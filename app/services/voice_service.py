from app.agents.ai_orchestrator import ai_orchestrator


class VoiceService:

    def process_voice_query(self, transcript: str):

        transcript = transcript.strip()

        if not transcript:
            return {
                "success": False,
                "message": "No voice input detected."
            }

        return ai_orchestrator.process(transcript)


voice_service = VoiceService()