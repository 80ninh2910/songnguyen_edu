import os

log_path = r"C:\Users\AN NINH\.gemini\antigravity\brain\2a6c7c51-abe0-4886-b087-b7599be3244a\.system_generated\tasks\task-37.log"
with open(log_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

patch_lines = []
for line in lines:
    if line.startswith('@@ -752,6'):
        break
    # Remove line numbers added by the tool (e.g., "1: warning: ...")
    if ":" in line:
        parts = line.split(":", 1)
        if parts[0].isdigit():
            # keep the rest of the line, strip the leading space if any
            content = parts[1]
            if content.startswith(" "):
                content = content[1:]
            patch_lines.append(content)
        else:
            patch_lines.append(line)
    else:
        patch_lines.append(line)

# Remove the first warning line
if patch_lines and patch_lines[0].startswith("warning:"):
    patch_lines.pop(0)

with open(r"d:\songnguyen_edu\good.patch", 'w', encoding='utf-8') as f:
    f.writelines(patch_lines)
