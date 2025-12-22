flowchart TD
    A[Bot Initialization]
    A --> B[Start Pairing Server]
    B --> C{Pair Request Received}
    C -- Yes --> D[Perform Pairing]
    C -- No --> E[Proceed to Connect]
    D --> E
    E --> F[Connect to WhatsApp]
    F --> G[Connection Established]
    G --> H[Listen for messages upsert]
    H --> I{Is Command Message}
    I -- Yes --> J[Parse Command]
    I -- No --> K[Ignore Message]
    J --> L{Command Category}
    L -- Owner --> M[Execute Owner Command]
    L -- Group --> N{Require Admin}
    N -- Yes --> O[Execute Group Command]
    N -- No --> P[Send Admin Required Error]
    L -- Main --> Q[Execute Main Command]
    M --> R[Send Response]
    O --> R
    P --> R
    Q --> R
    K --> R
    R --> S[End]