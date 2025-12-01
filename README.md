# VDIG: VLM Dashboard Insight Generator  
*A lightweight agentic workflow for generating and validating insights from BI dashboards using small vision-language models.*

---

## Overview

**VDIG** is a prototype system that explores how **small Vision-Language Models (≤3B parameters)** can augment business intelligence workflows by generating **concise, human-readable insights from BI dashboard**.

The system combines:
- **Vision-based insight generation** (VLMs)
- **Agentic orchestration** (via n8n)
- **Fact-check verification** (through SQL access to BI backend tables)
- **Supabase vector storage** (dashboards + historical insights)
- **Low-data-literacy support**
- **Daily dashboard simulation**

VDIG serves as the applied component of a broader goal:  
**embedding lightweight AI assistants into enterprise BI systems to improve clarity, speed, and decision support.**

---
