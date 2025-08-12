\# Development Steps \& Status



\*\*Last Updated:\*\* 2025-08-12 11:16:34



Este arquivo rastreia as tarefas de desenvolvimento do projeto MotoLab Voice Core. Ele deve ser atualizado pelo assistente Gemini após a conclusão de cada atividade.



---



\## To Do



\### Backend (Node.js + Express)



\* \*\*Estrutura Inicial e Segurança\*\*

&nbsp;   \* \[x] Configurar o projeto Node.js com Express. - 2025-08-12 11:16:34

&nbsp;   \* \[x] Implementar o banco de dados SQLite com a tabela `oauth\_tokens`. - 2025-08-12 11:16:34

&nbsp;   \* \[x] Escolher e instalar uma biblioteca de criptografia (ex: `crypto` nativo). - 2025-08-12 11:16:34

&nbsp;   \* \[x] Criar e configurar o arquivo `.env` com `JWT\_SECRET`, `GOOGLE\_CLIENT\_ID`, etc. - 2025-08-12 11:16:34

&nbsp;   \* \[x] Criar funções `encrypt(text)` e `decrypt(text)` para os tokens. - 2025-08-12 11:16:34



\* \*\*Fluxo de Autenticação OAuth 2.0\*\*

&nbsp;   \* \[ ] \*\*Endpoint `GET /auth/start`:\*\*

&nbsp;       \* \[x] Criar a rota `GET /auth/start`. - 2025-08-12 11:16:34

&nbsp;       \* \[x] Validar a presença do `deviceId` na query string. - 2025-08-12 11:16:34

&nbsp;       \* \[x] Gerar a `authUrl` do Google com `access\_type=offline`, o `scope` correto e o `deviceId` como `state`. - 2025-08-12 11:16:34

&nbsp;       \* \[x] Retornar a `authUrl` em uma resposta JSON. - 2025-08-12 11:16:34

&nbsp;   \* \[ ] \*\*Endpoint `GET /oauth2callback`:\*\*

&nbsp;       \* \[x] Criar a rota `GET /oauth2callback`. - 2025-08-12 11:16:34

&nbsp;       \* \[x] Extrair o `code` e `state` (deviceId) da resposta do Google. - 2025-08-12 11:16:34

&nbsp;       \* \[x] Usar o `code` para obter o `access\_token` e o `refresh\_token`. - 2025-08-12 11:16:34

&nbsp;       \* \[x] Criptografar o `refresh\_token` recebido. - 2025-08-12 11:16:34

&nbsp;       \* \[x] Salvar o `refresh\_token` criptografado e o `access\_token` no banco de dados, associados ao `deviceId`. - 2025-08-12 11:16:34

&nbsp;       \* \[x] Retornar uma página/mensagem de sucesso para o usuário fechar a janela. - 2025-08-12 11:16:34

&nbsp;   \* \[ ] \*\*Endpoint `GET /auth/status`:\*\*

&nbsp;       \* \[x] Criar a rota `GET /auth/status`. - 2025-08-12 11:16:34

&nbsp;       \* \[x] Validar o `deviceId` da query. - 2025-08-12 11:16:34

&nbsp;       \* \[x] Consultar o banco de dados para verificar a existência de um token para o `deviceId`. - 2025-08-12 11:16:34

&nbsp;       \* \[x] Retornar `{ authenticated: true/false }` baseado na consulta. - 2025-08-12 11:16:34



\* \*\*Endpoints do Google Drive\*\*

&nbsp;   \* \[x] Criar uma rota protegida `POST /drive/upload`. - 2025-08-12 11:16:34

&nbsp;   \* \[x] Criar uma rota protegida `GET /drive/list`. - 2025-08-12 11:16:34



\### Plugin Nativo (Kotlin + Capacitor)



\* \*\*Configuração e Permissões\*\*

&nbsp;   \* \[ ] Adicionar dependências do Vosk e Capacitor no `build.gradle`.

&nbsp;   \* \[ ] Implementar a solicitação de permissões de `BLUETOOTH\_CONNECT` e `RECORD\_AUDIO` no Android.



\* \*\*Captura de Áudio e STT Offline\*\*

&nbsp;   \* \[ ] \*\*Método `startCapture()`:\*\*

&nbsp;       \* \[ ] Implementar a lógica para iniciar a conexão de áudio Bluetooth (SCO).

&nbsp;       \* \[ ] Iniciar o serviço do Vosk-Android e prepará-lo para receber áudio.

&nbsp;       \* \[ ] Direcionar o stream de áudio do microfone para o Vosk.

&nbsp;   \* \[ ] \*\*Listener `onTranscription`:\*\*

&nbsp;       \* \[ ] Configurar o callback do Vosk para quando uma transcrição for gerada.

&nbsp;       \* \[ ] Usar `notifyListeners("onTranscription", { transcript: "..." })` para enviar o texto ao frontend.

&nbsp;   \* \[ ] \*\*Método `stopCapture()`:\*\*

&nbsp;       \* \[ ] Interromper o reconhecimento do Vosk.

&nbsp;       \* \[ ] Desconectar o áudio SCO.



\### Frontend (React + Capacitor)



\* \*\*Configuração Inicial\*\*

&nbsp;   \* \[x] Instalar dependências (`axios`, `@capacitor-community/sqlite`). - 2025-08-12 11:16:34

&nbsp;   \* \[x] Gerar e persistir um `deviceId` único no armazenamento local do app. - 2025-08-12 11:16:34



\* \*\*Serviços de Comunicação\*\*

&nbsp;   \* \[ ] \*\*`authService.js`:\*\*

&nbsp;       \* \[x] Criar função `startOAuth(deviceId)` para chamar o endpoint `GET /auth/start` do backend. - 2025-08-12 11:16:34

&nbsp;       \* \[x] Criar função `checkAuthStatus(deviceId)` para fazer polling no endpoint `GET /auth/status`. - 2025-08-12 11:16:34

&nbsp;   \* \[ ] \*\*`driveService.js`:\*\*

&nbsp;       \* \[x] Criar funções (`listDriveFiles`, `uploadFile`) que fazem chamadas autenticadas (JWT) para os endpoints do backend. - 2025-08-12 11:16:34



\* \*\*UI e Fluxo de Usuário\*\*

&nbsp;   \* \[ ] \*\*Autenticação:\*\*

&nbsp;       \* \[x] Criar um componente de UI (botão "Login com Google"). - 2025-08-12 11:16:34

&nbsp;       \* \[ ] Chamar `startOAuth` e abrir a `authUrl` retornada em uma Custom Tab.

&nbsp;       \* \[ ] Iniciar o polling com `checkAuthStatus` após o usuário ser redirecionado de volta ao app.

&nbsp;       \* \[ ] Atualizar o estado da UI para refletir o status de `authenticated`.

&nbsp;   \* \*\*Interação por Voz:\*\*

&nbsp;       \* \[ ] Criar botões na UI para chamar `MotoLabPlugin.startCapture()` e `stopCapture()`.

&nbsp;       \* \[ ] Adicionar um listener para o evento `onTranscription` do plugin.

&nbsp;       \* \[ ] Exibir a transcrição recebida em um campo de texto na tela.



---



\## In Progress



\*Nenhuma tarefa em andamento.\*



---



\## Done



\*Nenhuma tarefa concluída ainda.\*

