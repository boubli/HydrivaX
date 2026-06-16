#!/usr/bin/env bash

# HydrivaX OS v2.5 LXC Autopilot Proxmox VE Helper Script
# Copyright (c) 2026 Youssef Boubli
# License: MIT | https://github.com/boubli/HydrivaX/blob/main/LICENSE

set -euo pipefail

# 1. Pre-flight checks
if [ "$EUID" -ne 0 ]; then
  echo -e "\e[1;31mError: This script must run as root on your Proxmox host.\e[0m"
  exit 1
fi

if ! command -v pveversion >/dev/null 2>&1; then
  echo -e "\e[1;31mError: No Proxmox VE installation found. This script must run directly on the PVE host.\e[0m"
  exit 1
fi

# 2. Colors & Styling
RD="\e[1;31m"
GN="\e[1;32m"
YW="\e[1;33m"
BL="\e[1;34m"
CY="\e[1;36m"
CL="\e[0m"
BOLD="\e[1m"

# 3. ASCII Header
clear
echo -e "${CY}${BOLD}"
echo "    __  __              __     _             __  __"
echo "   / / / /_  ______  __/ /____(_)   ______ _ \ \/ /"
echo "  / /_/ / / / / __ \/ _  / ___/ / | / / __ \`/  \  / "
echo " / __  / /_/ / /_/ / (_/ / /  / /| |/ / (_| /  /  \ "
echo "/_/ /_/\__, / .___/\__,_/_/  /_/ |___/\__,_/  /_/\_\\"
echo "      /____/_/                                     "
echo -e "${CL}"
echo -e "${BOLD}HydrivaX OS v2.5 — LXC Autopilot Installer${CL}"
echo -e "This script will download the HydrivaX template and deploy a new LXC container."
echo "--------------------------------------------------------------------------------"

# 4. Interactive Configuration via Whiptail (standard on PVE)
if ! command -v whiptail >/dev/null 2>&1; then
  echo -e "${YW}Warning: whiptail is not installed. Falling back to non-interactive defaults...${CL}"
  USE_DEFAULTS="yes"
else
  if whiptail --title "HydrivaX LXC Installer" --yesno "Would you like to deploy HydrivaX OS v2.5 LXC using default settings?\n\n- 1 vCPU, 512 MB RAM, 2 GB Disk\n- Unprivileged, Nesting enabled (Docker ready)\n- DHCP Network (bridge: vmbr0)" 12 65; then
    USE_DEFAULTS="yes"
  else
    USE_DEFAULTS="no"
  fi
fi

# 5. Determine defaults or query user
NEXTID=$(pvesh get /cluster/nextid 2>/dev/null || echo "100")
DEFAULT_HN="hydrivax-lxc"
DEFAULT_RAM="512"
DEFAULT_CPU="1"
DEFAULT_DISK="2"

# Automatically find PVE storage types
TPL_STORAGE=$(pvesm status -content vztmpl 2>/dev/null | awk 'NR>1 {print $1; exit}' || echo "local")
DISK_STORAGE=$(pvesm status -content images 2>/dev/null | awk 'NR>1 {print $1; exit}' || echo "local-lvm")

if [ "$USE_DEFAULTS" = "yes" ]; then
  CTID="$NEXTID"
  HN="$DEFAULT_HN"
  RAM="$DEFAULT_RAM"
  CPU="$DEFAULT_CPU"
  DISK="$DEFAULT_DISK"
  TPL_STORE="$TPL_STORAGE"
  DISK_STORE="$DISK_STORAGE"
else
  # Prompt CT ID
  CTID=$(whiptail --title "Container ID" --inputbox "Please enter the ID for the new container:" 10 50 "$NEXTID" 3>&1 1>&2 2>&3 || exit 0)
  while [[ ! "$CTID" =~ ^[0-9]+$ ]]; do
    CTID=$(whiptail --title "Invalid ID" --inputbox "Container ID must be numeric. Please enter again:" 10 50 "$NEXTID" 3>&1 1>&2 2>&3 || exit 0)
  done

  # Prompt Hostname
  HN=$(whiptail --title "Hostname" --inputbox "Please enter a hostname:" 10 50 "$DEFAULT_HN" 3>&1 1>&2 2>&3 || exit 0)
  
  # Prompt RAM
  RAM=$(whiptail --title "Memory (MB)" --inputbox "Please enter allocation size in MB:" 10 50 "$DEFAULT_RAM" 3>&1 1>&2 2>&3 || exit 0)
  
  # Prompt CPU Cores
  CPU=$(whiptail --title "CPU Cores" --inputbox "Please enter number of CPU cores:" 10 50 "$DEFAULT_CPU" 3>&1 1>&2 2>&3 || exit 0)

  # Prompt Disk Size
  DISK=$(whiptail --title "Disk Size (GB)" --inputbox "Please enter disk size in GB (minimum 2):" 10 50 "$DEFAULT_DISK" 3>&1 1>&2 2>&3 || exit 0)

  # Choose Template Storage
  mapfile -t TPL_STORES < <(pvesm status -content vztmpl 2>/dev/null | awk 'NR>1 {print $1}')
  if [ ${#TPL_STORES[@]} -gt 1 ]; then
    TPL_OPTIONS=()
    for s in "${TPL_STORES[@]}"; do
      TPL_OPTIONS+=("$s" "Template storage")
    done
    TPL_STORE=$(whiptail --title "Template Storage" --menu "Select storage for templates:" 15 50 6 "${TPL_OPTIONS[@]}" 3>&1 1>&2 2>&3 || exit 0)
  else
    TPL_STORE="${TPL_STORES[0]:-local}"
  fi

  # Choose Disk Storage
  mapfile -t DISK_STORES < <(pvesm status -content images 2>/dev/null | awk 'NR>1 {print $1}')
  if [ ${#DISK_STORES[@]} -gt 1 ]; then
    DISK_OPTIONS=()
    for s in "${DISK_STORES[@]}"; do
      DISK_OPTIONS+=("$s" "Container disk storage")
    done
    DISK_STORE=$(whiptail --title "Disk Storage" --menu "Select storage for container disks:" 15 50 6 "${DISK_OPTIONS[@]}" 3>&1 1>&2 2>&3 || exit 0)
  else
    DISK_STORE="${DISK_STORES[0]:-local-lvm}"
  fi
fi

# 6. Retrieve storage path & download template
echo -e "\n${BL}[Info]${CL} Querying template cache path for storage '${TPL_STORE}'..."
TPL_FILE="HydrivaX-v2.5-LXC.tar.zst"
TPL_PATH=$(pvesm path "${TPL_STORE}:vztmpl/${TPL_FILE}" 2>/dev/null || echo "/var/lib/vz/template/cache/${TPL_FILE}")

TPL_DIR=$(dirname "$TPL_PATH")
mkdir -p "$TPL_DIR"

if [ ! -f "$TPL_PATH" ]; then
  echo -e "${BL}[Info]${CL} Downloading HydrivaX OS v2.5 LXC template..."
  URL="https://github.com/boubli/HydrivaX/releases/download/lxc-v2.5/${TPL_FILE}"
  if ! curl -L -o "$TPL_PATH" --progress-bar "$URL"; then
    echo -e "${RD}[Error]${CL} Failed to download template from $URL"
    exit 1
  fi
  echo -e "${GN}[Success]${CL} Template saved to $TPL_PATH"
else
  echo -e "${GN}[Success]${CL} Template already cached at $TPL_PATH"
fi

# 7. Create LXC container
echo -e "\n${BL}[Info]${CL} Creating container ${HN} (ID: ${CTID}) on storage ${DISK_STORE}..."

# Net settings
NET_CONF="name=eth0,bridge=vmbr0,ip=dhcp"

# Create call
if pct create "$CTID" "$TPL_PATH" \
  -storage "$DISK_STORE" \
  -rootfs "${DISK_STORE}:${DISK}" \
  -cores "$CPU" \
  -memory "$RAM" \
  -net0 "$NET_CONF" \
  -ostype debian \
  -unprivileged 1 \
  -features nesting=1 \
  -onboot 1 \
  -hostname "$HN" \
  -tags "hydrivax;os;lxc"; then
  echo -e "${GN}[Success]${CL} Container created successfully."
else
  echo -e "${RD}[Error]${CL} Failed to create LXC container."
  exit 1
fi

# 8. Start container and report status
echo -e "${BL}[Info]${CL} Starting container ${CTID}..."
pct start "$CTID"

echo -e "${BL}[Info]${CL} Waiting for container network IP address (DHCP)..."
IP=""
for i in {1..15}; do
  sleep 2
  IP=$(pct exec "$CTID" -- ip -4 addr show eth0 2>/dev/null | awk '/inet / {print $2}' | cut -d/ -f1 | head -n 1 || true)
  if [ -n "$IP" ]; then
    break
  fi
done

# 9. Summary
echo "--------------------------------------------------------------------------------"
echo -e "${GN}${BOLD}Completed Successfully!${CL}"
echo -e "Container ${BOLD}${HN} (${CTID})${CL} has been initialized."
echo -e "  - CPU Cores:   ${CPU}"
echo -e "  - Memory:      ${RAM} MB"
echo -e "  - Disk:        ${DISK} GB"
if [ -n "$IP" ]; then
  echo -e "  - IP Address:  ${GN}${BOLD}${IP}${CL}"
else
  echo -e "  - IP Address:  ${YW}DHCP Pending (Network configuration active)${CL}"
fi
echo -e "  - Login:       root / hydrivax"
echo "--------------------------------------------------------------------------------"
echo -e "To access the container console:    ${CY}pct enter ${CTID}${CL}"
echo -e "To SSH into the container:          ${CY}ssh root@${IP:-<container-ip>}${CL}"
echo "--------------------------------------------------------------------------------"
