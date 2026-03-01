📊 Loan Risk Prediction Web Application

A production-style Loan Risk Prediction Web Application designed using real-world banking and underwriting logic.
This system evaluates loan applicants and classifies them as LOW RISK or HIGH RISK using a combination of rule-based decisioning and ML-assisted risk evaluation.

project: https://loan-risk-prediction.lovable.app

🚀 Project Overview

Financial institutions face significant losses due to loan defaults. This application helps banks and NBFCs assess credit risk before loan approval, reducing default probability and improving decision quality.

The system analyzes key applicant attributes such as income, credit score, debt burden, employment type, and past default history to generate:

Safe Probability

Default Risk Probability

Risk Classification

Decision Recommendation

🧠 Key Features

📌 Real-world banking logic aligned with underwriting standards

📌 Clear separation of Safe Probability and Default Risk Probability

📌 Strong emphasis on Past Default History (highest risk weight)

📌 Debt-to-Income and Loan-to-Income risk evaluation

📌 Professional decision recommendations (Approve / Reject / Collateral)

📌 Clean, interview-ready UI and explanations

🏗️ Tech Stack
Frontend

React.js

Tailwind / CSS

Responsive UI

Backend

Python (Flask / FastAPI)

REST APIs

JSON-based request handling

Machine Learning / Logic

Rule-based risk evaluation

ML-assisted probability scoring

Credit score classification aligned with Indian banking standards

🧮 Risk Evaluation Parameters
Parameter	Description
Age	Applicant’s earning stage
Monthly Income	Repayment capacity
Employment Type	Income stability
Credit Score	Creditworthiness
Existing EMIs	Debt burden
Loan Amount	Exposure risk
Loan Purpose	Secured / unsecured risk
Past Default History	Strongest default predictor
📈 Credit Score Classification (India)

750+ → Excellent

700–749 → Good

650–699 → Average

550–649 → Poor

<550 → Very Poor

🔍 Sample Prediction Output (High Risk)

Safe Probability: 4%

Default Risk Probability: 96%

Risk Status: 🔴 High Risk

Decision Recommendation: Reject application or require collateral / guarantor

🧠 Business Logic Highlights

Applicants with past defaults are heavily penalized

DTI > 40% significantly increases risk

Loan-to-Annual-Income > 1.0x exceeds safe lending thresholds

Poor credit score (<650) places borrower in sub-prime category

⚖️ Disclaimer

This prediction is generated using ML-assisted risk analysis and should be used as a decision-support tool, not a final approval system. Financial institutions should conduct independent due diligence before making lending decisions.

📦 How to Run Locally (Optional)
# Backend
pip install -r requirements.txt
python app.py

# Frontend
npm install
npm start
🎯 Use Cases

Banks & NBFCs

Loan officers & underwriters

FinTech credit assessment tools

Academic & ML demonstration projects

👤 Author

Mohd Kaif

Aspiring Full-Stack Developer & Data Enthusiast

Built using modern AI-assisted development tools.
