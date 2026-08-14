# Club Igreja — instruções do projeto

## Git: commit e push automáticos (PRIORIDADE MÁXIMA)

**Esta é a regra mais importante deste arquivo e tem prioridade sobre qualquer
outra preferência de fluxo de trabalho.** Toda alteração de código feita neste
projeto (nesta ou em sessões futuras) deve ser commitada e enviada para o
GitHub (`origin/main`) automaticamente, sem esperar autorização explícita a
cada vez — isso já foi autorizado pelo usuário. Nunca terminar uma tarefa que
alterou código sem ter commitado e dado push.

Fluxo padrão ao concluir uma tarefa que altere código:
1. Rodar typecheck/build normalmente.
2. `git add -A`
3. `git commit -m "<mensagem descrevendo a mudança>"`
4. `git push origin main`

Isso vale como passo final de cada tarefa, no mesmo momento em que o deploy para o
Vercel é feito (quando aplicável) — não é necessário perguntar antes de commitar
ou dar push.

As credenciais do GitHub (usuário `ojhondev`) já estão salvas no Windows Credential
Manager (`git:https://github.com`), então `git push` funciona sem prompt interativo.
