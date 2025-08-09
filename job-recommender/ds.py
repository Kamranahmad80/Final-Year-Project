import csv
import random

# ✅ Job roles list (150+ roles)
job_roles = [
    "Frontend Developer", "Backend Developer", "Full Stack Developer", "Mobile App Developer", "Game Developer",
    "UI/UX Designer", "Web Developer", "React Developer", "Angular Developer", "Vue.js Developer", "Next.js Developer",
    "WordPress Developer", "Shopify Developer", "Drupal Developer", "Magento Developer",
    "Data Scientist", "Machine Learning Engineer", "Deep Learning Engineer", "AI Researcher", "NLP Engineer",
    "Computer Vision Engineer", "Data Analyst", "BI Analyst", "Data Engineer", "Big Data Engineer",
    "Quantitative Analyst", "Generative AI Engineer", "LLM Engineer", "Prompt Engineer", "AI Product Manager",
    "Cloud Architect", "DevOps Engineer", "Site Reliability Engineer", "Cloud Security Engineer", "AWS Engineer",
    "Azure Engineer", "GCP Engineer", "Platform Engineer", "CI/CD Engineer", "Infrastructure Engineer",
    "Cybersecurity Analyst", "Information Security Analyst", "Security Engineer", "Ethical Hacker", "Penetration Tester",
    "SOC Analyst", "Cloud Security Specialist", "Incident Response Specialist", "Application Security Engineer",
    "Forensic Analyst", "Blockchain Developer", "Smart Contract Developer", "Solidity Developer", "Web3 Developer",
    "Crypto Wallet Developer", "NFT Marketplace Developer", "DApp Developer", "Blockchain Architect", "Ethereum Developer",
    "DeFi Developer", "AR Developer", "VR Developer", "AR/VR Game Developer", "Unity Developer", "Unreal Engine Developer",
    "3D Game Developer", "XR Developer", "Metaverse Developer", "Simulation Developer", "Game Physics Engineer",
    "IoT Engineer", "Embedded Systems Engineer", "Network Engineer", "Network Security Engineer", "Firmware Developer",
    "Robotics Engineer", "Control Systems Engineer", "Embedded Linux Engineer", "Automation Engineer", "Hardware Engineer",
    "QA Engineer", "Test Automation Engineer", "Performance Test Engineer", "Manual Tester", "Security Tester", "QA Lead",
    "SDET", "API Tester", "Mobile QA Engineer", "Product Manager", "Technical Project Manager", "Scrum Master", "Agile Coach",
    "IT Manager", "Engineering Manager", "Program Manager", "Technical Lead", "Solutions Architect", "Delivery Manager",
    "Quantum Computing Researcher", "Edge Computing Engineer", "Robotics AI Engineer", "Autonomous Vehicle Engineer",
    "Drone Software Engineer", "Space Tech Engineer", "Bioinformatics Data Scientist", "AR/VR UI Designer", "Digital Twin Developer",
    "AI Ethics Officer", "UI Designer", "UX Researcher", "Motion Graphics Designer", "Interaction Designer", "Creative Technologist",
    "Digital Marketing Analyst", "SEO Specialist", "Content Strategist", "Growth Hacker", "API Developer", "Microservices Developer",
    "Integration Engineer", "Middleware Engineer", "ERP Developer", "SAP Developer", "Salesforce Developer", "CRM Developer",
    "Payment Gateway Developer", "Chatbot Developer", "Research Scientist (AI)", "Research Engineer", "Innovation Specialist",
    "Technical Evangelist", "Developer Advocate", "Cloud Solutions Evangelist", "Blockchain Research Scientist", "AI Solution Architect",
    "Generative Design Engineer", "ML Ops Engineer", "Tech Support Engineer", "Systems Administrator", "Database Administrator",
    "Cloud Migration Specialist", "HPC Engineer", "GIS Developer", "BioTech Software Developer", "Automotive Software Engineer",
    "Audio Signal Processing Engineer", "Streaming Platform Developer"
]

# ✅ Randomized pools for diversity
summaries = [
    "Passionate about delivering innovative and scalable solutions for modern businesses.",
    "Experienced in building robust applications using cutting-edge technologies.",
    "Tech enthusiast with exceptional problem-solving and analytical thinking skills.",
    "Focused on creating intuitive and user-centric designs for seamless experiences.",
    "Result-driven professional with a proven record of meeting tight deadlines.",
    "Creative thinker with expertise in full-stack application development.",
    "Detail-oriented engineer passionate about automation and performance optimization.",
    "Innovator with experience in AI-powered and cloud-native systems.",
    "Driven by curiosity and motivated to solve complex real-world problems.",
    "Committed to continuous learning and adopting emerging technologies."
]
certifications = [
    "AWS Certified Solutions Architect – Professional",
    "Google Cloud Professional Cloud Architect",
    "Certified Kubernetes Administrator (CKA)",
    "Microsoft Azure Solutions Expert",
    "Scrum Master Certification (CSM)",
    "Certified Ethical Hacker (CEH)",
    "Project Management Professional (PMP)",
    "Data Science Professional Certificate – IBM",
    "TensorFlow Developer Certificate",
    "UI/UX Design Professional Certification",
    "Oracle Java SE 11 Developer",
    "Red Hat Certified Engineer (RHCE)",
    "Salesforce Certified Platform Developer",
    "Docker Certified Associate",
    "MongoDB Certified Developer",
    "Certified Blockchain Developer"
]
achievements = [
    "Improved application performance by 35% through optimized database queries.",
    "Reduced deployment time by 50% by implementing automated CI/CD pipelines.",
    "Mentored and led a team of 12 engineers on a large-scale cloud migration project.",
    "Published 4 research papers in top-tier AI journals.",
    "Developed a fintech app with over 150k active users and 4.8-star rating.",
    "Optimized cloud infrastructure resulting in 30% cost savings annually.",
    "Won 1st place at National Hackathon 2023 for an AI-powered solution.",
    "Implemented microservices architecture reducing system downtime by 60%.",
    "Increased user engagement by 45% through UI/UX enhancements.",
    "Launched an e-commerce platform that processed 1M+ transactions in the first year."
]
degrees = [
    "B.Sc. Computer Science",
    "B.Tech in Information Technology",
    "M.Sc. in Software Engineering",
    "M.Tech in Data Science",
    "MBA in Technology Management",
    "Bachelor of Engineering in Electronics & Communication",
    "Bachelor of Science in Artificial Intelligence",
    "Master of Science in Cybersecurity",
    "Bachelor of Design in UI/UX",
    "Ph.D. in Machine Learning and AI"
]
skills_pool = [
    "Python", "Java", "C++", "C#", "JavaScript", "TypeScript", "React", "Angular", "Vue.js",
    "Next.js", "Node.js", "Express.js", "Spring Boot", "Django", "Flask",
    "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "GraphQL",
    "Docker", "Kubernetes", "Jenkins", "CI/CD", "Terraform", "Ansible",
    "AWS", "Azure", "Google Cloud", "CloudFormation", "Serverless",
    "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "OpenCV",
    "Figma", "Adobe XD", "Sketch", "Photoshop", "Wireframing", "Prototyping",
    "Blockchain", "Solidity", "Web3.js", "Smart Contracts", "Truffle",
    "Cybersecurity", "Penetration Testing", "Firewalls", "Wireshark", "Nmap",
    "Agile", "Scrum", "Kanban", "JIRA", "Confluence", "Git", "GitHub", "Bitbucket"
]
# ✅ Function to generate random resume text
def generate_resume():
    summary = random.choice(summaries)
    skills = ", ".join(random.sample(skills_pool, random.randint(5, 10)))
    experience_years = random.choice(["1 year", "3 years", "5+ years", "7+ years", "10+ years"])
    exp = f"Worked on multiple projects over {experience_years}, delivering end-to-end solutions."
    project = f"Developed {random.choice(['an AI-powered system', 'a scalable web platform', 'a mobile app with 50k+ downloads'])}."
    education = random.choice(degrees)
    certification = random.choice(certifications)
    achievement = random.choice(achievements)
    return f"SUMMARY: {summary}\nSKILLS: {skills}\nEXPERIENCE: {exp}\nPROJECTS: {project}\nEDUCATION: {education}\nCERTIFICATIONS: {certification}\nACHIEVEMENTS: {achievement}"

# ✅ Function to generate random categories (1–3 job roles)
def generate_categories():
    return random.sample(job_roles, random.randint(1, 3))

# ✅ Generate CSV file with large dataset
rows = []
for _ in range(20000):  # 20k resumes
    resume = generate_resume()
    category = generate_categories()
    rows.append([resume, str(category)])

with open("synthetic_resume_dataset.csv", "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["resume", "category"])
    writer.writerows(rows)

print("✅ Dataset generated: synthetic_resume_dataset.csv with 20,000 resumes")
