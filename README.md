# TEW 

  

> This repo contains  small e wallet service  with authentication wallet and wallet transactions functionalities 

 
## Table of contents


- [E wallet](#tew)
-  [Table of contents](#table-of-contents)

- [Important](#important)

- [Todo](#todo)

- [Documentation](#documentation)

- [run the application](#run-the-application)

- [Strategy](#Strategy)


  

## Important

  

> This repo contain limited functionalities ,  like create and read only for modules

  

* It contain user authentication and authorization functionality(signup  and login ) 

* normal user can create a wallet 
* normal user can do a transaction and their wallet will be deducted or toped up depend on transaction
* norma user can view their wallets and transactions 
* admin can view users wallets and transactions 
* there is no database transactions 
* This project use nest frameword and typescript , it use postgres DB as a database and you will need to have postgress db configured in ur system to be able to run the project 


  

## Todo

  

* [ ] DB Transaction 

* [ ] Dockerization of service

* [ ] implement micro service


  

## Documentation

  

Documentation of tekana e wallet is postman collection in root of this project file name `Tekana E Wallet.postman_collection.json`

  

  

## run the application 

  

How to contribute in this repo

  

1. clone this repo .
```bash

git clone git@github.com:salviosage/tew.git

```

2. open repo codebase 
3. create env file and copy the env example to env and replace necessary env valiable with your local data like database connection variables   



```bash

touch .env && cp .env.example .env 

```

 

4. install dependecies 

  

```bash

yarn install 

```

  

5. start the project  PS please make sure you are all set with env valiables and db 

  

```bash

yarn run start:dev

```


6. open your postman and use documentation to navigate trough the project and consume endpoints 

The postman collection is in root of the project file name `Tekana E Wallet.postman_collection.json`

 
## Strategy


Step-by-step strategy for revamping the "Tekana-eWallet" legacy application's back-end solution:


Day 1 - 7: Project Kick-off and Planning

-   Assemble the Team: Gather the entire team, including engineers, UI/UX designers, product owner, Scrum Master, and subject matter experts from the business team.
    
-     
    
-   Define Clear Objectives: Clearly articulate the goals and objectives of the project, emphasising the need for a modern, scalable, and efficient back-end system.
    
-     
    
-   Requirements Gathering: Collaborate closely with the business team to understand customer needs and gather detailed requirements for the new back-end system.
    
-     
    
-   Technology Stack Evaluation: Assess the current technology stack and explore options for a top-notch back-end stack. Consider factors like scalability, security, and maintainability.
    
-     
    
-   Create a Project Plan: Develop a detailed project plan with milestones, timelines, and resource allocation. Identify potential risks and mitigation strategies.
    
-     
    

Day 8 - 30: Architecture and Design

-   System Architecture Design: Work with architects and senior engineers to design the new back-end architecture. Ensure it aligns with scalability, security, and performance requirements.
    
-     
    
-   Front-End Collaboration: Collaborate closely with front-end and UI/UX teams to understand their requirements and ensure the back-end design supports a seamless user experience.
    
-     
    
-   Prototyping: Create prototypes or proof of concepts to validate key architectural decisions and gather feedback from stakeholders.
    
-   Select Development Tools and Frameworks: Choose the most suitable programming languages, frameworks, and tools for the back-end development.
    

  

-   Security and Compliance: Implement robust security measures and ensure compliance with relevant regulations (e.g., data privacy laws).
    

  
  

Day 31 - 90: Development

-   Agile Development: Adopt Agile methodologies (e.g., Scrum) for development, with a dedicated Scrum Master to facilitate the process.
    
-     
      
    
-   Continuous Integration/Continuous Deployment (CI/CD): Implement CI/CD pipelines to automate testing, integration, and deployment processes for faster development cycles.
    
-   Code Reviews and Quality Assurance: Enforce strict code review practices and quality assurance to maintain high-quality code.
    
-   Documentation: Ensure comprehensive documentation of code, APIs, and system architecture for future reference and onboarding of new team members.
    
-   Testing and QA: Rigorous testing, including unit testing, integration testing, and user acceptance testing, to identify and fix issues early.
    
-     
    

Day 91 - 120: Pilot System

  

-   Pilot System Deployment: Deploy a pilot version of the new back-end system to a limited group of users or in a controlled environment.
    

  

-   User Feedback: Collect feedback from pilot users and make necessary improvements based on their input.
    
-   Performance Optimization: Fine-tune system performance, addressing any bottlenecks or issues identified during the pilot phase.
    
-   Training and Knowledge Transfer: Train the operations and support teams on managing and maintaining the new system.
    
-   Prepare for Full Rollout: Ensure all necessary preparations are in place for the full-scale deployment.
    

  

Day 121 - Go-Live

-   Full-Scale Deployment 21. Full-Scale Deployment: Roll out the new back-end system to all 1 million customers worldwide in a phased approach to minimise disruption.
    
-   Monitoring and Support: Implement robust monitoring and support mechanisms to quickly address any issues that may arise post-launch.
    
-   Feedback Loop: Establish a feedback loop with users and stakeholders to continuously improve the system.
    
-   Post-Launch Optimization: Continuously monitor system performance and make optimizations as needed.
    

  

Throughout the project, maintain clear communication channels with all stakeholders, conduct regular status updates, and ensure alignment with the overall business strategy. Adapt the strategy as necessary based on feedback and changing requirements to ensure a successful revamp of the "Tekana-eWallet" back-end solution.


