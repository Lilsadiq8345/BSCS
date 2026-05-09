Browser Secure Code Server
Microservices architecture
Main Structure (overview)
User/Developer
You can only code, you can't paste or download code to your computer.
Terminal will not have access to these things like sudo etc.
The UI will be very simple and will not have many functions.
When multiple users work on the same project, they will be marked with color like this

Admin
Can create, delete, and change user passwords
You can monitor how many hours you were connected and what you did.
You can see the server load, see the memory space, see how many users are active, and how long it worked.
A user can be given access to specific folders that the entire customer will not be given access to, such as  .env etc.
Admin will deploy automatically and manually to GitHub/gitlab
All test admins will have CICD.

UI → Next.js + Tailwind
Editor → Monaco
Backend → NestJS (TypeScript)
Sandbox → Docker
The goal of this project is to create a secure development environment where:
Developers can write code using a browser
Code will always be safe on the server
Access can be strictly controlled
Screenshots cannot be taken, videos cannot be made, the code must be kept completely secure.
System Overview
This system is a self-hosted cloud coding environment:
Developer Browser
↓
HTTPS Secure Connection
↓
Code Server (VS Code in browser)
↓
Restricted Linux User Folder
↓
Project Files + Backup System
Core Technology
browser-based  Code editor
Linux VPS Server
Nginx Reverse Proxy
SSL (HTTPS Security)
Linux User Permission System
Security Features

1. Access Control
Password protected login
Only authorized users can access
Only the specific project folder will be open
Cannot see anything else
Separate Linux user
only this path access:
Folder Restriction
Developer can access only assigned project folder
System folders are hidden
Network Security
Firewall enabled (UFW)
Only required ports open (80, 443, 22 etc)
HTTPS Encryption
SSL certificate enabled
Secure communication between browser and server
User Isolation
Separate Linux user for each developer
No root access
File Structure Example
/home/devuser/project/
├── frontend/
├── backend/
└── admin/
 Restrictions
No root/system access
No access to hidden directories
No direct database access
Limited terminal permissions
Backup System
Daily automatic backup
Stored in secure location
Prevents data loss
2. Container Isolation (Advanced)
The developer environment will run in a Docker container.
Will be isolated from the main server system
Session Control
Inactive session auto logout
One-time session token system
IP Whitelisting
No one will be able to login without a specific IP.
Access from unknown location will be blocked
VPN Mandatory Access (WireGuard )
Developers will only be able to access the server via VPN.
Direct public IP access will be disabled
Restriction:
❌ Copy / paste disabled
❌ File download disabled
❌ USB blocked
❌No local drive access
Database Security
Direct DB access ❌
Data only via API
Legal Layer
NDA sign
Contract:
code reuse ❌
sharing ❌
৫. Monitoring
Keep a log of who is doing what.
Detect suspicious activity
Terminal limit
You won't give a full terminal ❌
Rather:
Create a "controlled command runner"
Example:
শুধু allow:
node file.js
python file.py
etc
❌ block:
Git
Sudo
su
curl
Wget
apt
etc

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
user

When multiple users work on the same project, they will be marked with color like this

Admin login page

<https://chatgpt.com/c/69fb360e-53b4-8320-bc03-79b9054877ab>

<https://chatgpt.com/backend-api/estuary/content?id=file_0000000046b871fdb9f05e32b01eb4b3&ts=493920&p=fs&cid=1&sig=5119e0393e359e116c5668f05c630b3f956168642474b0f2d4e4258c16fadf4a&v=0>
