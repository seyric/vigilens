from app.agents.ai_router import ai_router


class AIOrchestrator:

    def process(self, query: str):

        try:

            response = ai_router.route(query)

            return {
                "success": True,
                "query": query,
                "response": response
            }

        except Exception as e:

            return {
                "success": False,
                "query": query,
                "error": str(e)
            }


ai_orchestrator = AIOrchestrator()