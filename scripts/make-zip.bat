@echo off
cd /d c:\PROJELER\YAPI2
if exist next-build.zip del /f next-build.zip
"C:\Program Files\7-Zip\7z.exe" a -tzip next-build.zip .next -xr!cache -xr!dev -xr!turbopack -xr!trace -xr!trace-build -xr!diagnostics -xr!node_modules -mx=5
echo ZIP BOYUTU:
for %%F in (next-build.zip) do echo %%~zF bytes
