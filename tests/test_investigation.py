from app.ai.investigation_assistant import investigation_assistant

question = "Show me burglary cases involving motorcycles."

result = investigation_assistant.investigate(question)

print("\n========== TOP MATCHING CASES ==========\n")

for i, case in enumerate(result["matches"], start=1):
    print(f"Case {i}")
    print(f"Similarity : {case['score']:.4f}")
    print(case["document"])
    print("-" * 50)

print("\n========== VIGILENS AI ANALYSIS ==========\n")
print(result["answer"])
print("\n=========================================")