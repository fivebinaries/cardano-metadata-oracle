
<img src=".github/cardano_metadata_oracle_logo.png" align="right" height="200" />

# Cardano Metadata Oracle

This repository contains the code and configuration files of the metadata oracle for Cardano.

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> 
</p>
<br><br>

## Key Features

* Data source definitions templates that are easy to share within the community
* Fetching and scraping of data with error handling and retries
* Transaction construction, including dynamic fee estimation
* Support for remote API [Blockfrost.io](https://blockfrost.io)

### Planning

* Support for full local Cardano node (using `cardano-cli`) ([#7](https://github.com/fivebinaries/cardano-metadata-oracle/issues/7))
* Prometheus style endpoint for monitoring and Grafana integration ([#6](https://github.com/fivebinaries/cardano-metadata-oracle/issues/6))

## Installation

### NixOS

If you are not running NixOS, you need to at least install [Nix](https://nixos.org/download.html)

```bash
$ curl -L https://nixos.org/nix/install | sh
```

After installing Nix, add the following to `/etc/nix/nix.conf` to take advantage of the cache, so you do not have to rebuild everything. After adding it, you need to restart the `nix-daemon` service.

```
substituters         = https://cache.nixos.org https://ergo-nix.cachix.org
trusted-public-keys  = cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY= ergo-nix.cachix.org-1:5T2FPh0TfxXqrMYAwf/VGDycBW6Dy/W/L6I3DFhc1iQ=
```

If you are using NixOS, you probably know how to add these as your binary caches.

### Docker

## Usage
