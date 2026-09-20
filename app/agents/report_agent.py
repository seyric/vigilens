from app.services.gemini_service import gemini_service


class ReportAgent:

    def generate_report(
        self,
        investigation_result
    ):

        prompt = f"""
You are an expert police investigation officer.

Using the investigation findings below, generate a professional investigation report.

The report should contain:

1. Case Summary
2. Key Findings
3. Suspect Information
4. Recommended Next Steps
5. Conclusion

Investigation Findings:

{investigation_result}
"""

        return gemini_service.ask(prompt)


report_agent = ReportAgent()