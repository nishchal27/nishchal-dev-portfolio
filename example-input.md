Simple examples (good for testing)
1. Basic social media app:
A social media platform for developers where users can share code snippets, follow each other, and comment on posts. Expected 10,000 users initially, growing to 100,000 within a year.
2. E-commerce platform:
An e-commerce platform selling digital products (software licenses, courses). Users can browse, purchase, and download. Need to handle 1,000 transactions per day, with peak traffic during sales events.
3. Real-time chat app:
A real-time chat application for teams with channels, direct messages, and file sharing. Teams of 5-50 people, need to support 10,000 concurrent users.
Medium complexity examples
4. AI-powered content platform:
A content generation platform where users can create blog posts, social media content, and marketing copy using AI. Users purchase credits to generate content. Expected 50,000 users, 1 million AI requests per month. Budget-conscious startup.
5. Video streaming service:
A video streaming platform for educational content. Users can upload videos, create playlists, and watch with progress tracking. Need to support 100,000 users watching simultaneously, with video storage and CDN for global delivery.
6. Marketplace with payments:
A two-sided marketplace connecting freelancers with clients. Features include profiles, job postings, messaging, escrow payments, and reviews. Team of 5 developers, need to scale to 1 million users.
Complex examples
7. Multi-tenant SaaS:
A project management SaaS with real-time collaboration, file storage, time tracking, and reporting. Multi-tenant architecture needed. Each organization can have 10-1000 users. Need to support 10,000 organizations.
8. IoT data platform:
An IoT platform collecting sensor data from 100,000 devices, processing it in real-time, and providing analytics dashboards. Devices send data every 5 minutes. Need to handle data ingestion, storage, and real-time alerts.
With constraints specified
9. Budget-constrained startup:
A task management app for small teams. Features include tasks, projects, team collaboration, and notifications. Team size: 2 developers. Budget: $500/month for infrastructure. Need to start simple but plan for 10,000 users.
10. High-scale system:
A news aggregation platform that crawls 10,000 news sources every hour, processes articles with NLP, and serves personalized feeds to 5 million users. Need to handle high read traffic and real-time updates.
Quick test input (minimal)
11. Minimal test:
A blog platform with posts and comments
Tips for testing
Start simple: Use example #11 to verify the flow works.
Add constraints: Include scale, budget, or team size for more specific outputs.
Be specific: Mention technologies if you have preferences (e.g., "using PostgreSQL").
Include scale: Mention expected users/traffic for scaling considerations.
What to expect
The AI should return:
Architecture diagram with components (database, cache, API, etc.)
Component connections showing data flow
Tradeoffs for each component
Risk analysis
Scaling considerations
Technology recommendations
Try example #1 or #4 first; they work well and produce detailed outputs.