# Class Diagram: Electus Modular Monolith Backend

This class diagram represents the actual class structures, internal module dependencies, properties, and methods implemented in the Electus NestJS backend.

---

```mermaid
classDiagram
  %% Relations
  CandidatesController ..> CandidatesService : uses
  CandidatesController ..> EmailService : uses
  CandidatesService ..> Candidate : manages (TypeORM)
  CandidatesService ..> AiService : uses (in-memory)
  CandidatesService ..> DocumentsService : uses (in-memory)
  
  AuthController ..> AuthService : uses
  AuthService ..> UsersService : uses
  AnalyticsController ..> AnalyticsService : uses

  %% Service Groups
  namespace electus_backend_monolith {
    class Candidate {
      +string id
      +string fullName
      +string email
      +string phone
      +string reviewStatus
      +string processingStatus
      +string[] aiSummary
      +string cvText
      +string[] skills
      +any hollandCode
      +string education
      +string experience
      +string portfolioUrl
      +boolean hasPortfolio
      +number matchScore
      +string cvFilePath
      +number[] embedding
      +Date createdAt
    }

    class CandidatesController {
      -candidatesService: CandidatesService
      -emailService: EmailService
      +create(body: Partial~Candidate~) Promise~Candidate~
      +uploadCv(file: Express.Multer.File) Promise~Candidate~
      +search(query: string) Promise~Candidate[]~
      +findAll() Promise~Candidate[]~
      +findOne(id: string) Promise~Candidate~
      +updateStatus(id: string, reviewStatus: string) Promise~Candidate~
      +removeDuplicates() Promise~any~
      +removeAll() Promise~any~
      +removeByStatus(status: string) Promise~any~
      +remove(id: string) Promise~any~
      +sendInvite(id: string, body: any) Promise~any~
      +getProcessingStatus(id: string) Promise~any~
      +getCultureFit(id: string, target: string) Promise~any~
    }

    class CandidatesService {
      -candidateRepository: Repository~Candidate~
      -aiService: AiService
      -documentsService: DocumentsService
      +create(data: Partial~Candidate~) Promise~Candidate~
      +findAll() Promise~Candidate[]~
      +findOne(id: string) Promise~Candidate~
      +updateStatus(id: string, reviewStatus: string) Promise~Candidate~
      +remove(id: string) Promise~any~
      +removeAll() Promise~any~
      +removeByStatus(status: string) Promise~any~
      +removeDuplicates() Promise~any~
      +uploadCv(file: Express.Multer.File) Promise~Candidate~
      +semanticSearch(query: string) Promise~Candidate[]~
      +getCultureFit(id: string, targetStr: string) Promise~any~
    }

    class AiService {
      +analyzeCv(cvText: string) Promise~CvAnalysis~
      +generateEmbedding(text: string) Promise~number[]~
      +cosineSimilarity(a: number[], b: number[]) number
    }

    class DocumentsService {
      +extractText(file: Express.Multer.File) Promise~string~
    }

    class EmailService {
      -transporter: nodemailer.Transporter
      +sendInterviewInvite(candidateName: string, candidateEmail: string, jobTitle: string, interviewDate: string, hrName: string, customMessage: string) Promise~any~
    }

    class AuthService {
      -usersService: UsersService
      -jwtService: JwtService
      +register(deviceName: string, fullName: string, email: string, passwordHash: string) Promise~any~
      +login(deviceName: string, email: string, passwordHash: string) Promise~any~
      +logout(token: string) Promise~any~
    }

    class UsersService {
      -usersRepository: Repository~User~
      -sessionsRepository: Repository~UserSession~
      +findByEmail(email: string) Promise~User~
      +createSession(user: User, deviceName: string, token: string, expiresAt: Date) Promise~UserSession~
      +validateSession(userId: string, token: string) Promise~boolean~
    }
  }
```
