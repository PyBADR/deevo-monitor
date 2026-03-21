@echo off
set PATH=C:\Program Files\Git\cmd;%PATH%
cd /d C:\Users\acer\Documents\deevo-monitor

del tag.bat 2>nul
git add -A
git commit -m "chore: cleanup" 2>&1
git push 2>&1

echo === REPO VIEW ===
gh repo view PyBADR/deevo-monitor --json url,pushedAt,description,topics 2>&1
echo === DONE ===
