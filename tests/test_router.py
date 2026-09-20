from app.agents.ai_router import ai_router

query = input("Enter your query: ")

response = ai_router.route(query)

print("\n========== RESPONSE ==========\n")

print(response)

print("\n==============================")