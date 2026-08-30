# Waldo - Implementação do Figma

Frontend React independente criado a partir do design do Waldo.

## Executar

1. Inicie o PostgreSQL e o backend na porta `8080`.
2. Instale as dependências com `npm install`.
3. Inicie o frontend com `npm run dev`.
4. Acesse `http://localhost:5174`.

O Vite encaminha requisições de `/api` para `http://localhost:8080`, evitando a necessidade de alterar o CORS do backend durante o desenvolvimento.

Para deploy, defina `VITE_API_URL` com a URL pública do backend.
