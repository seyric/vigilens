from app.services.gemini_service import gemini_service

def main():
    print("=" * 50)
    print("🛡️ Vigilens")
    print("=" * 50)

    while True:
        question = input("\nAsk Vigilens (type 'exit' to quit): ")

        if question.lower() == "exit":
            print("\nGoodbye!")
            break

        response = gemini_service.ask(question)

        print("\nVigilens:\n")
        print(response)


if __name__ == "__main__":
    main()