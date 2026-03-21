@echo off
set PATH=C:\Program Files\Git\cmd;%PATH%
cd /d C:\Users\acer\Documents\deevo-monitor

del push.bat push2.bat git_status.txt _out.txt 2>nul
git add -A
git commit -m "chore: remove temp scripts" 2>&1
git push 2>&1

gh repo edit PyBADR/deevo-monitor --add-topic gcc --add-topic insurance --add-topic risk-monitoring --add-topic geopolitical --add-topic osint --add-topic ai --add-topic dashboard --add-topic deevo --add-topic ollama --add-topic gulf --add-topic intelligence --add-topic typescript 2>&1

echo === FINAL ===
git log --oneline -3
echo === DONE ===
