# Vigilens Desktop Setup

## Development

1. Copy `.env.example` to `.env`.
2. Set a long random `SECRET_KEY` in `.env`.
3. Set `VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1`.
4. Install dependencies with `npm install`.
5. Start the desktop app with `npm run desktop:dev`.

The development launcher starts Vite on `http://127.0.0.1:5199/`, starts FastAPI on `http://127.0.0.1:8000/`, and opens the Electron window in fullscreen kiosk mode.

## AI providers

Ollama is the default provider and keeps sensitive prompts local:

```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b
```

Cloud providers require an API key created in the provider's own account. Do not commit keys, copy keys from the internet, or put them in frontend source. Set `GEMINI_API_KEY` in the local `.env` only when using `AI_PROVIDER=gemini`.

Open-source model servers that expose the OpenAI-compatible API are also supported. This includes llama.cpp, vLLM, LocalAI, LM Studio, and compatible Open WebUI deployments:

```env
AI_PROVIDER=openai-compatible
OPENAI_COMPATIBLE_BASE_URL=http://127.0.0.1:8080/v1
OPENAI_COMPATIBLE_API_KEY=
OPENAI_COMPATIBLE_MODEL=local-model
OPENAI_COMPATIBLE_EMBED_MODEL=
```

Provider aliases such as `vllm`, `llamacpp`, `localai`, and `lmstudio` select the same adapter. The server must be running locally before an AI request is made.

## USB key policy

The desktop host supports an opt-in file-hash gate. This is a local launch policy, not a replacement for OS or hardware-backed authentication.

1. Put a random key file on the authorized removable drive.
2. Calculate its hash with PowerShell:

```powershell
(Get-FileHash E:\vigilens.key -Algorithm SHA256).Hash
```

3. Set these variables in the local environment used to launch Electron:

```env
USB_KEY_REQUIRED=true
USB_KEY_PATH=E:\vigilens.key
USB_KEY_SHA256=replace-with-the-sha256-value
```

The application exits when the file is missing or its SHA-256 hash does not match.

## Windows installer

```powershell
# Install the Python desktop packaging extra once:
pip install -e ".[dev]"
npm run desktop:build
```

The installer is written to the electron-builder output directory and includes a packaged `vigilens-server.exe` that serves this PC over localhost. The admin installer uses the same shell and opens directly into the protected administration console:

```powershell
npm run admin:build
```

If electron-builder reports a Windows `EPERM` rename error while staging Chromium, close any running Vigilens/Electron/Vite processes and remove the matching `release-*\win-unpacked*` directory before retrying. Windows security software can also hold that temporary directory open.
