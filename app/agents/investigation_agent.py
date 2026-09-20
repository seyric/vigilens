from app.rag.retriever import retriever
from app.rag.context_builder import context_builder
from app.prompts.prompt_builder import prompt_builder
from app.services.gemini_service import gemini_service


class InvestigationAgent:

    def investigate(self, question):

        results = retriever.retrieve(question)

        context = context_builder.build(results)

        prompt = prompt_builder.build(
            question,
            context
        )

        return gemini_service.ask(prompt)


investigation_agent = InvestigationAgent()
