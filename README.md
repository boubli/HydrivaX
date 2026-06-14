<p align="center">
  <img src="logo.png" alt="HydrivaX" width="200">
</p>

<h3 align="center">HydrivaX</h3>
<p align="center">Minimal headless Linux for self-hosted infrastructure.<br>Proxmox LXC template · bootable server ISO</p>
<p align="center"><a href="https://boubli.github.io/HydrivaX/">Website</a> · <a href="https://github.com/boubli/HydrivaX/releases">Download</a></p>

---

## What is this

HydrivaX is a stripped-down Debian 12 base with a modular CLI toolkit for deploying services. No GUI, no desktop, no bloat — just a clean starting point for running your own stuff.

Two editions are supported:

| Edition | Format | Size | Use case |
|---------|--------|------|----------|
| **HydrivaX OS** | bootable `.iso` | ~565 MB | Old PCs, mini PCs, VirtualBox, Proxmox VMs |
| **LXC Template** | `.tar.zst` | 99 MB | Proxmox containers |

The LXC rootfs is aggressively stripped: no kernel modules, no firmware, no bootloader, no locales. The OS ISO is a text-only Debian Live server image with HydrivaX branding and CLI tools pre-installed.

## CLI

```
$ hx-deploy list

╔══════════════════════════════════════════════════════════════╗
║  hx-deploy — HydrivaX Deployment Engine                    ║
╚══════════════════════════════════════════════════════════════╝

  ── Networking & Security ──
     ○ wireguard    — WireGuard VPN tunnel
     ○ tailscale    — Tailscale mesh VPN
     ○ crowdsec     — CrowdSec collaborative IPS
     ○ fail2ban     — Brute-force protection
     ○ ufw          — Uncomplicated Firewall
     ○ certbot      — Let's Encrypt SSL certificates
     ...

  ── Storage & Data ──
     ○ restic       — Encrypted backup engine
     ○ nextcloud    — Self-hosted cloud platform
     ○ minio        — S3-compatible object storage
     ...

  ── Dev & Coding ──
     ○ docker       — Docker Engine + Compose v2
     ○ neovim       — Hyper-extensible text editor
     ○ postgres     — PostgreSQL database server
     ...

  ── Monitoring & Telemetry ──
     ○ grafana      — Metrics visualization dashboard
     ○ prometheus   — Metrics collection engine
     ○ uptime-kuma  — Self-hosted uptime monitor
     ...

  ── Automation & Utilities ──
     ○ ansible      — Ansible automation engine
     ○ k3s          — Lightweight Kubernetes
     ○ terraform    — Infrastructure as Code
     ...

  Total: 99 modules | Installed: 0 | Available: 99
```

Nothing is pre-installed. Each module is a small shell script that installs on demand:

```bash
hx-deploy docker        # install docker
hx-deploy remove docker  # uninstall it
hx-deploy verify docker  # check if it's working
```

## Tools

| Command | Description |
|---------|-------------|
| `hx-deploy <module>` | Install a module |
| `hx-deploy list` | List all 99 modules |
| `hx-deploy remove <module>` | Uninstall a module |
| `hx-deploy search <term>` | Search modules |
| `hx-status` | System dashboard (CPU, RAM, disk, services) |
| `hx-info` | OS version and system info |
| `hx-update` | Update system packages |

## Install

For a detailed, step-by-step guide with screenshots for Proxmox (LXC/VM), VirtualBox, VMware, and physical hardware, check out the [Full Installation Guide](https://boubli.github.io/HydrivaX/install.html).

### HydrivaX OS ISO

Download `HydrivaX-v1.2-Server-amd64.iso` from [Releases](https://github.com/boubli/HydrivaX/releases).

#### Option A: Virtual Machines (Proxmox, VirtualBox, VMware)
1. Upload the ISO to your hypervisor's storage. For Proxmox:
   ```bash
   scp HydrivaX-v1.2-Server-amd64.iso root@PROXMOX_IP:/var/lib/vz/template/iso/
   ```
2. Create a new VM (1-2 vCPUs, 1-2 GB RAM, SATA/VirtIO).
3. Attach the ISO to the CD/DVD drive and boot.

#### Option B: Physical Hardware / Bare Metal (Mini PCs, Intel NUC, Old PCs)
1. Write the ISO to a USB drive (8GB+) using **Rufus**, **BalenaEtcher**, or **Ventoy**.
2. Insert the USB drive into your target machine.
3. Access the boot menu (F12, F11, F8, Esc) and boot from USB.
4. *Tip:* Enter your BIOS/UEFI settings and **disable Secure Boot**.

Live credentials:
```text
user: live
pass: hydrivax
```

Recommended boot entries:
- **VGA Text** for VirtualBox, Proxmox noVNC, local monitors
- **Serial Console** for Proxmox serial terminal (ttyS0) and headless machines
- **Fail-safe** for older or difficult hardware

### LXC template

Download `HydrivaX-v2.0-LXC.tar.zst` from [Releases](https://github.com/boubli/HydrivaX/releases).

```bash
# upload to proxmox
scp HydrivaX-v2.0-LXC.tar.zst root@PROXMOX_IP:/var/lib/vz/template/cache/

# create container from proxmox ui, then:
hx-info
hx-deploy list
```

## Modules

<details>
<summary><strong>Networking & Security</strong> (20 modules)</summary>

| Module | Description |
|--------|-------------|
| wireguard | WireGuard VPN tunnel |
| tailscale | Tailscale mesh VPN |
| crowdsec | CrowdSec collaborative IPS |
| ufw | Uncomplicated Firewall |
| fail2ban | Brute-force protection |
| pihole | DNS-level ad blocker |
| nginx-proxy-manager | Reverse proxy with SSL |
| tor | Tor anonymity relay/proxy |
| i2p | I2P anonymous network |
| killswitch | Network kill switch (iptables) |
| netbird | NetBird zero-trust mesh |
| nmap | Network scanner |
| lynis | Security audit tool |
| vault | HashiCorp Vault secrets manager |
| ssh-hardening | SSH hardening (keys-only) |
| wipe | Secure disk/file wiper |
| iptables-persist | Persistent iptables rules |
| certbot | Let's Encrypt SSL |
| zerotier | ZeroTier SD-WAN |
| dnscrypt | Encrypted DNS proxy |

</details>

<details>
<summary><strong>Storage & Data</strong> (19 modules)</summary>

| Module | Description |
|--------|-------------|
| restic | Encrypted backup engine |
| syncthing | Continuous file sync |
| minio | S3-compatible object storage |
| immich | Self-hosted photo/video backup |
| nextcloud | Self-hosted cloud platform |
| rclone | Cloud storage Swiss army knife |
| zfs | ZFS filesystem tools |
| btrfs | Btrfs filesystem tools |
| ipfs | InterPlanetary File System |
| sftp-jail | Jailed SFTP server |
| samba | SMB/CIFS file shares |
| nfs | NFS server |
| borgbackup | Deduplicated backup |
| duplicati | Cloud backup client |
| lvm | Logical Volume Manager |
| mergerfs | Union filesystem (drive pooling) |
| snapraid | Snapshot RAID for data drives |
| sqlite | SQLite database tools |
| mariadb | MariaDB database server |

</details>

<details>
<summary><strong>Dev & Coding</strong> (20 modules)</summary>

| Module | Description |
|--------|-------------|
| docker | Docker Engine + Compose v2 |
| podman | Daemonless container engine |
| neovim | Hyper-extensible text editor |
| tmux | Terminal multiplexer |
| rustup | Rust toolchain installer |
| golang | Go programming language |
| nvm | Node.js version manager |
| python3-venv | Python 3 + venv + pip |
| postgres | PostgreSQL database server |
| redis | Redis in-memory data store |
| rabbitmq | RabbitMQ message broker |
| gh-cli | GitHub CLI |
| gitea | Self-hosted Git service |
| drone-ci | Drone CI/CD pipeline |
| act | Run GitHub Actions locally |
| lazygit | Terminal UI for git |
| lazydocker | Terminal UI for Docker |
| just | Modern command runner |
| aider | AI pair programming CLI |
| dev-containers | Docker dev containers |

</details>

<details>
<summary><strong>Monitoring & Telemetry</strong> (20 modules)</summary>

| Module | Description |
|--------|-------------|
| prometheus | Metrics collection engine |
| grafana | Metrics visualization dashboard |
| netdata | Real-time performance monitoring |
| uptime-kuma | Self-hosted uptime monitor |
| glances | System monitoring CLI |
| zabbix-agent | Zabbix monitoring agent |
| healthchecks | Cron job monitoring |
| sysstat | System performance tools |
| dstat | Versatile resource stats |
| node-exporter | Prometheus hardware exporter |
| cadvisor | Container resource monitoring |
| loki | Log aggregation system |
| vector | High-perf log pipeline |
| goaccess | Real-time web log analyzer |
| telegraf | Metrics collection agent |
| ntopng | Network traffic probe |
| vnstat | Network traffic monitor |
| iotop | I/O usage monitor |
| bpftrace | Linux tracing tool |
| ctop | Container metrics viewer |

</details>

<details>
<summary><strong>Automation & Utilities</strong> (20 modules)</summary>

| Module | Description |
|--------|-------------|
| ansible | Ansible automation engine |
| terraform | Infrastructure as Code |
| k3s | Lightweight Kubernetes |
| watchtower | Auto-update Docker containers |
| portainer | Docker management UI |
| cloudflared | Cloudflare Tunnel daemon |
| cockpit | Web-based server manager |
| traefik | Cloud-native reverse proxy |
| homepage | Self-hosted app dashboard |
| amud | AMUD-Dashboard |
| cron-mgr | Interactive crontab manager |
| taskfile | Task runner (Taskfile.yml) |
| shellcheck | Shell script linter |
| auto-update | Unattended-upgrades config |
| power-gov | CPU governor manager |
| cpu-temp | CPU temperature monitor |
| fsck-helper | Filesystem check utility |
| hx-backup-svc | Automated backup scheduler |
| logs-cleaner | Automated log rotation/cleanup |
| webmin | System admin web interface |

</details>

## Specs

| | HydrivaX OS ISO | LXC Template |
|---|---|---|
| Base | Debian 12 Live (Bookworm) | Debian 12 (Bookworm) |
| Size | ~565 MB | 99 MB compressed |
| Format | Bootable amd64 ISO | Proxmox LXC `.tar.zst` |
| Target | VMs, mini PCs, old hardware | Proxmox containers |
| Shell | bash | bash |
| Edition | Headless CLI, text-only live | Headless CLI |

## License

Custom Non-Commercial License (Free for personal use, commercial use prohibited) — see [LICENSE](LICENSE).

## Author

Youssef Boubli ([@boubli](https://github.com/boubli))
