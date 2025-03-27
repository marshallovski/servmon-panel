#  Web panel - API
*Last update: 24.03.2025*

**Base:** `/server`

## General
- `GET /server/health`
	- **Name:** health
	- **Description:** Displays availability of the server.

## Status
**Base:** `/status`

### Hardware
**Base:** `/hardware`

Note: information **about GPU** is at **Info** endpoint below.

- ### CPU
	- `GET /server/status/hardware/cpu`
		- **Name:** cpu
		- **Description:** Displays information about CPU's present on the machine.

- ### RAM
	- `GET /server/status/hardware/ram`
		- **Name:** ram
		- **Description:** Displays information about RAM on the machine.

- ### Storage
	- `GET /server/status/hardware/storage`
		- **Name:** storage
		- **Description:** Displays information about disks on the machine.

- ### Network
	- `GET /server/status/network`
		- **Name:** network
		- **Description:** Displays information about network interfaces and network speeds on the machine.


- ### Uptime
	- `GET /server/status/hardware/uptime`
		- **Name:** uptime
		- **Description:** Displays information about machine's uptime.

## Info
**Base:** `/info`

- ### Env
    - `GET /server/info/env`
        - Name: env
        - Description: basic info about server (hostname, web panel version, server id, etc.)

- ### GPU
    - `GET /server/info/gpu`
        - Name: gpu
        - Description: Displays information about GPU's present on the machine.


- ### Host
    - `GET /server/info/host`
        - Name: host
        - Description: Displays information about machine/host.



*To be updated.*