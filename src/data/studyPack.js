export const studyPack = [
  {
    "subject": "Python Programming",
    "slug": "python",
    "items": [
      {
        "id": "python-1",
        "title": "Variables and data types",
        "explanation": "Python names refer to objects; assignment does not copy an object. Integers, floats, strings and booleans are common scalar types. Lists and dictionaries are mutable, while strings and tuples are immutable.",
        "example": "price = 120; quantity = 3; total = price * quantity",
        "analysis": "total is 360. Convert input using int() before arithmetic; input() returns a string.",
        "question": "Why does changing an aliased list affect both names?",
        "answer": "Both names refer to the same mutable list."
      },
      {
        "id": "python-2",
        "title": "Control flow and loops",
        "explanation": "if selects a branch using a condition. for iterates over an iterable; while repeats while its condition is true. range excludes its stop value.",
        "example": "sum(range(1, 6))",
        "analysis": "The result is 15. Use break to exit a loop and continue to skip an iteration.",
        "question": "What values does range(2, 8, 2) produce?",
        "answer": "2, 4, 6."
      },
      {
        "id": "python-3",
        "title": "Functions and scope",
        "explanation": "A function packages reusable behavior. Parameters receive arguments and return passes a result to the caller. A local name normally exists only within its function.",
        "example": "def square(n): return n * n",
        "analysis": "square(5) returns 25. Avoid mutable default arguments if state must not persist between calls.",
        "question": "What does a function without an explicit return produce?",
        "answer": "None."
      },
      {
        "id": "python-4",
        "title": "Lists, dictionaries and sets",
        "explanation": "Lists preserve sequence order and permit duplicates. Dictionaries map unique hashable keys to values. Sets store unique hashable members and support membership tests.",
        "example": "scores = {'Ana': 80, 'Ravi': 90}; scores.get('Ana')",
        "analysis": "The result is 80. Use get with a default when a key might not exist.",
        "question": "Which collection removes duplicate values naturally?",
        "answer": "A set."
      },
      {
        "id": "python-5",
        "title": "Exceptions and file handling",
        "explanation": "Exceptions signal failures. try and except handle expected errors; finally runs cleanup. A with statement closes a file when its block exits.",
        "example": "with open('notes.txt', encoding='utf-8') as f: text = f.read()",
        "analysis": "The file is closed even if reading raises an exception. Catch specific errors such as FileNotFoundError.",
        "question": "Why use with instead of manually closing files?",
        "answer": "It ensures cleanup when the block exits."
      }
    ]
  },
  {
    "subject": "Java Programming",
    "slug": "java",
    "items": [
      {
        "id": "java-1",
        "title": "Classes and objects",
        "explanation": "A class defines fields and methods; an object is an instance. A constructor initializes an instance. Private fields and public methods can enforce an invariant.",
        "example": "class Counter { private int n; void add(){ n++; } int value(){ return n; } }",
        "analysis": "A new Counter begins with n equal to zero. Calling add increases its state.",
        "question": "What distinguishes a class from an object?",
        "answer": "A class is a definition; an object is an instance."
      },
      {
        "id": "java-2",
        "title": "Inheritance and polymorphism",
        "explanation": "A subclass extends one class and may implement multiple interfaces. Overridden instance methods are selected according to the runtime object. Overloading instead chooses among signatures at compile time.",
        "example": "Animal a = new Dog(); a.speak();",
        "analysis": "If Dog overrides speak, its implementation runs. This illustrates dynamic dispatch.",
        "question": "Can Java extend two classes directly?",
        "answer": "No; a class can implement multiple interfaces."
      },
      {
        "id": "java-3",
        "title": "Arrays and collections",
        "explanation": "Arrays have fixed length. ArrayList supports variable size and indexed access. HashMap stores key-value pairs; HashSet stores unique values.",
        "example": "List<Integer> xs = new ArrayList<>(); xs.add(7);",
        "analysis": "The list contains one Integer. Generics provide type checking at compile time.",
        "question": "When is HashMap preferable to ArrayList?",
        "answer": "When retrieving values by keys rather than numeric positions."
      },
      {
        "id": "java-4",
        "title": "Exception handling",
        "explanation": "Checked exceptions generally must be caught or declared. RuntimeException subclasses are unchecked. try-with-resources closes AutoCloseable resources.",
        "example": "try { Integer.parseInt(\"abc\"); } catch (NumberFormatException e) { }",
        "analysis": "Parsing fails and the specific exception is caught. Avoid silently swallowing unexpected errors.",
        "question": "Why catch a specific exception?",
        "answer": "It avoids hiding unrelated failures."
      },
      {
        "id": "java-5",
        "title": "Interfaces and access modifiers",
        "explanation": "An interface specifies a contract; classes implement its abstract methods. public permits broad access, private confines access to the declaring class, and package access applies within the package.",
        "example": "interface Shape { double area(); }",
        "analysis": "A Circle class can implement Shape and define area. Clients can depend on Shape rather than Circle.",
        "question": "What is the benefit of programming to an interface?",
        "answer": "Clients depend on a contract rather than a specific implementation."
      }
    ]
  },
  {
    "subject": "Data Structures & Algorithms",
    "slug": "dsa",
    "items": [
      {
        "id": "dsa-1",
        "title": "Time complexity",
        "explanation": "Big-O bounds growth of resource use as input size increases. Sequential scans are linear; binary search halves a sorted search interval. Nested independent scans over n items are quadratic.",
        "example": "for i in range(n): for_each_of_n_items()",
        "analysis": "If the inner operation visits n items, total work is O(n^2). Constants do not change asymptotic growth.",
        "question": "What is the complexity of a single linear scan?",
        "answer": "O(n)."
      },
      {
        "id": "dsa-2",
        "title": "Stacks and queues",
        "explanation": "Stacks remove the most recently added item (LIFO). Queues remove the earliest item (FIFO). A deque supports additions and removals at both ends.",
        "example": "Push A, push B, pop; enqueue A, enqueue B, dequeue.",
        "analysis": "The stack returns B; the queue returns A.",
        "question": "Which structure models breadth-first search?",
        "answer": "A queue."
      },
      {
        "id": "dsa-3",
        "title": "Linked lists",
        "explanation": "A linked list stores nodes with references to other nodes. Inserting after a known node can be constant time, but finding an indexed element is linear in a singly linked list.",
        "example": "A -> B -> C; insert X after A.",
        "analysis": "Update X.next to B, then A.next to X. The chain becomes A -> X -> B -> C.",
        "question": "Why is random access slower than in an array?",
        "answer": "Nodes must be traversed to reach an index."
      },
      {
        "id": "dsa-4",
        "title": "Searching and sorting",
        "explanation": "Binary search requires sorted input and runs in logarithmic time. Merge sort divides and merges sequences in O(n log n) time. Insertion sort can be useful on small or nearly sorted data.",
        "example": "Binary search for 7 in [1, 3, 5, 7, 9].",
        "analysis": "Check 5, then the right interval, where 7 is found.",
        "question": "Why does binary search need sorted input?",
        "answer": "Ordering determines which half can safely be discarded."
      },
      {
        "id": "dsa-5",
        "title": "Trees and graph traversal",
        "explanation": "A tree is a connected acyclic undirected graph. DFS explores along a path before backtracking; BFS explores by distance in an unweighted graph. A visited set prevents repeated graph visits.",
        "example": "Edges A-B, A-C, B-D; BFS from A.",
        "analysis": "A, then B and C, then D, assuming alphabetical neighbors.",
        "question": "What finds shortest paths in an unweighted graph?",
        "answer": "Breadth-first search."
      }
    ]
  },
  {
    "subject": "Computer Networks",
    "slug": "networks",
    "items": [
      {
        "id": "networks-1",
        "title": "OSI and TCP/IP models",
        "explanation": "OSI describes seven conceptual layers: physical, data link, network, transport, session, presentation and application. TCP/IP groups practical Internet protocols into fewer layers.",
        "example": "HTTP over TCP over IP over Ethernet.",
        "analysis": "Each layer supplies services to the layer above. IP addresses support routing; link addresses serve local delivery.",
        "question": "Which OSI layer handles routing?",
        "answer": "Network layer."
      },
      {
        "id": "networks-2",
        "title": "IP addressing and subnetting",
        "explanation": "IPv4 addresses are 32 bits. A CIDR prefix states the number of network bits. A /24 leaves eight host bits; ordinary broadcast subnets reserve the first and last addresses.",
        "example": "192.168.1.0/24",
        "analysis": "Network .0, broadcast .255, conventional usable hosts .1 through .254.",
        "question": "How many total addresses are in a /26?",
        "answer": "64."
      },
      {
        "id": "networks-3",
        "title": "TCP and UDP",
        "explanation": "TCP provides an ordered reliable byte stream using acknowledgments and retransmission. UDP sends datagrams without built-in delivery guarantees. Applications can implement additional reliability.",
        "example": "File transfer typically uses TCP; real-time media may use UDP.",
        "analysis": "Choose based on delivery semantics and latency requirements, not an assumption that UDP is always faster.",
        "question": "Which protocol preserves datagram boundaries?",
        "answer": "UDP."
      },
      {
        "id": "networks-4",
        "title": "DNS and HTTP",
        "explanation": "DNS resolves names to records such as IP addresses. HTTP defines request-response semantics, including methods and status codes. HTTPS protects HTTP traffic using TLS.",
        "example": "GET /notes HTTP request",
        "analysis": "A 200 response indicates success; 404 indicates a missing resource. DNS and HTTP are separate protocols.",
        "question": "What does HTTPS add to HTTP?",
        "answer": "TLS-based confidentiality, integrity and server authentication."
      },
      {
        "id": "networks-5",
        "title": "Bandwidth, latency and throughput",
        "explanation": "Bandwidth describes link capacity; throughput is achieved data transfer rate. Latency measures delay, and jitter measures variation in delay.",
        "example": "A 10 MB file over an ideal 20 Mb/s link.",
        "analysis": "10 MB is 80 Mb using decimal units; minimum transmission time is 4 seconds, ignoring overhead.",
        "question": "Can a high-bandwidth link have high latency?",
        "answer": "Yes; propagation and queuing delays are independent of capacity."
      }
    ]
  },
  {
    "subject": "Database Management",
    "slug": "dbms",
    "items": [
      {
        "id": "dbms-1",
        "title": "Relational model and keys",
        "explanation": "Tables contain rows and columns. Candidate keys uniquely identify rows; one is selected as the primary key. Foreign keys reference a unique key in another table.",
        "example": "Students(id PRIMARY KEY); Enrolments(student_id REFERENCES Students(id)).",
        "analysis": "The foreign key prevents enrolments referencing nonexistent students unless NULL is allowed.",
        "question": "What is referential integrity?",
        "answer": "Consistency of references between related rows."
      },
      {
        "id": "dbms-2",
        "title": "SQL queries and aggregation",
        "explanation": "SELECT retrieves rows; WHERE filters rows before grouping. GROUP BY forms groups; HAVING filters grouped results. COUNT(*) counts rows including those with NULL fields.",
        "example": "SELECT subject, COUNT(*) FROM notes GROUP BY subject;",
        "analysis": "Produces one count per subject. Add HAVING COUNT(*) > 2 to filter groups.",
        "question": "Which clause filters aggregate results?",
        "answer": "HAVING."
      },
      {
        "id": "dbms-3",
        "title": "Joins and relationships",
        "explanation": "INNER JOIN keeps matching rows; LEFT JOIN also keeps unmatched left rows with NULL right-side values. Many-to-many relationships are often modeled with a junction table.",
        "example": "SELECT s.id, e.course_id FROM students s LEFT JOIN enrolments e ON s.id=e.student_id;",
        "analysis": "Students without enrolments remain in the result.",
        "question": "Which join keeps every left row?",
        "answer": "LEFT JOIN."
      },
      {
        "id": "dbms-4",
        "title": "Normalization",
        "explanation": "Normalization reduces redundancy and update anomalies. 1NF uses atomic values; 2NF removes partial dependencies of non-prime attributes on candidate keys; 3NF addresses transitive dependencies under its formal conditions.",
        "example": "Enrolment(student, course, course_name) with key (student, course).",
        "analysis": "Move course_name into a Course table because it depends on course alone.",
        "question": "Why separate course_name?",
        "answer": "To avoid repeated facts and update anomalies."
      },
      {
        "id": "dbms-5",
        "title": "Transactions and indexes",
        "explanation": "ACID describes atomicity, consistency, isolation and durability. Transactions group changes. Indexes speed suitable lookups but consume storage and add write overhead.",
        "example": "BEGIN; UPDATE accounts SET balance=balance-10 WHERE id=1; ... COMMIT;",
        "analysis": "A transfer should debit and credit within one transaction; rollback on failure.",
        "question": "Why not index every column?",
        "answer": "Indexes cost storage and maintenance during writes."
      }
    ]
  },
  {
    "subject": "Web Development",
    "slug": "web",
    "items": [
      {
        "id": "web-1",
        "title": "Semantic HTML",
        "explanation": "HTML describes document structure. Use headings in logical order, nav for navigation, main for primary content, and labels for form inputs. Semantic elements support accessibility.",
        "example": "<label for=\"email\">Email</label><input id=\"email\" type=\"email\">",
        "analysis": "The label is associated with the input. Use buttons for actions and links for navigation.",
        "question": "Why use a button instead of a clickable div?",
        "answer": "Native buttons provide keyboard and accessibility behavior."
      },
      {
        "id": "web-2",
        "title": "CSS layout and responsive design",
        "explanation": "Flexbox arranges items along an axis; Grid controls rows and columns. Media queries adapt layout to available space. The box model includes content, padding, border and margin.",
        "example": "display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr));",
        "analysis": "Columns adapt to available width. Test narrow screens and avoid fixed widths that overflow.",
        "question": "What does box-sizing:border-box do?",
        "answer": "Declared width includes padding and border."
      },
      {
        "id": "web-3",
        "title": "JavaScript DOM and events",
        "explanation": "The DOM represents document nodes. addEventListener registers handlers. Events can bubble through ancestors, enabling delegation. Prefer textContent for untrusted plain text.",
        "example": "button.addEventListener('click', () => output.textContent = 'Done');",
        "analysis": "Clicking updates text without parsing HTML.",
        "question": "Why avoid innerHTML for untrusted input?",
        "answer": "It may introduce cross-site scripting."
      },
      {
        "id": "web-4",
        "title": "Fetch and asynchronous requests",
        "explanation": "fetch returns a Promise resolving to a Response. HTTP errors such as 404 normally do not reject the promise. Check response.ok and handle parsing errors.",
        "example": "const r = await fetch('/api/notes'); if (!r.ok) throw Error('Request failed');",
        "analysis": "Then parse JSON with await r.json() if the response is JSON.",
        "question": "Does fetch automatically reject on HTTP 500?",
        "answer": "No; check response.ok or status."
      },
      {
        "id": "web-5",
        "title": "Accessibility and web security",
        "explanation": "Use meaningful labels, visible keyboard focus and sufficient contrast. Validate inputs on the server; client validation is for usability. Escape untrusted content and avoid exposing secrets.",
        "example": "A form button uses disabled while a request is pending.",
        "analysis": "Provide status text and restore controls after completion. Authorization must still be enforced by the server.",
        "question": "Is hiding an admin button sufficient authorization?",
        "answer": "No; the backend must enforce permissions."
      }
    ]
  },
  {
    "subject": "Operating Systems",
    "slug": "os",
    "items": [
      {
        "id": "os-1",
        "title": "Processes and threads",
        "explanation": "A process provides an execution environment and address space. Threads share process resources but maintain execution state such as stacks. Context switching changes the running task.",
        "example": "A browser may run multiple processes and threads.",
        "analysis": "Threads can share memory efficiently but require synchronization for shared mutable state.",
        "question": "What do threads in the same process share?",
        "answer": "The process address space and many resources."
      },
      {
        "id": "os-2",
        "title": "CPU scheduling",
        "explanation": "Scheduling chooses a runnable task. FCFS uses arrival order, round robin uses time quanta, and shortest-job approaches prioritize short work under suitable assumptions.",
        "example": "Round robin with tasks A and B, quantum 2 ms.",
        "analysis": "A runs up to 2 ms, then B runs up to 2 ms if both remain runnable.",
        "question": "What does a very small quantum increase?",
        "answer": "Context-switch overhead."
      },
      {
        "id": "os-3",
        "title": "Memory management",
        "explanation": "Virtual memory maps virtual addresses to physical memory. Paging divides address spaces into pages and physical memory into frames. A page fault may require loading a page or rejecting access.",
        "example": "A program accesses a valid page not currently resident.",
        "analysis": "The OS may load it and update page tables before resuming execution.",
        "question": "What is a page table used for?",
        "answer": "Mapping virtual pages to physical frames and permissions."
      },
      {
        "id": "os-4",
        "title": "Synchronization and deadlocks",
        "explanation": "Locks protect critical sections. Deadlock can occur when tasks wait indefinitely for each other. The four classic necessary conditions are mutual exclusion, hold and wait, no preemption and circular wait.",
        "example": "Task A locks X then waits for Y; task B locks Y then waits for X.",
        "analysis": "Acquiring locks in a consistent order can prevent circular wait.",
        "question": "Which condition is broken by global lock ordering?",
        "answer": "Circular wait."
      },
      {
        "id": "os-5",
        "title": "File systems and storage",
        "explanation": "A file system organizes persistent data and metadata. Directories map names to file objects. Permissions control access; journaling can improve crash recovery.",
        "example": "Saving a file updates data blocks and metadata.",
        "analysis": "A crash can interrupt writes; durability may require explicit synchronization.",
        "question": "Why are file permissions important?",
        "answer": "They restrict unauthorized reading, modification or execution."
      }
    ]
  },
  {
    "subject": "Cybersecurity",
    "slug": "security",
    "items": [
      {
        "id": "security-1",
        "title": "CIA triad and risk",
        "explanation": "Confidentiality limits disclosure, integrity prevents unauthorized alteration, and availability ensures access when needed. Risk combines likelihood and impact; controls reduce risk.",
        "example": "Encrypt sensitive backups, verify checksums, and test restoration.",
        "analysis": "These address confidentiality, integrity and availability respectively.",
        "question": "Which goal is threatened by a denial-of-service incident?",
        "answer": "Availability."
      },
      {
        "id": "security-2",
        "title": "Authentication and authorization",
        "explanation": "Authentication establishes identity; authorization determines permitted actions. MFA combines different factor types. Least privilege limits access to what a role needs.",
        "example": "A student signs in but cannot access the admin dashboard.",
        "analysis": "Server-side role checks must enforce this even if the admin link is hidden.",
        "question": "What is the difference between authentication and authorization?",
        "answer": "Identity verification versus permission decisions."
      },
      {
        "id": "security-3",
        "title": "Encryption and hashing",
        "explanation": "Encryption is reversible with an appropriate key. Cryptographic hashing maps data to a fixed-size digest. Password storage requires a salted, slow password-hashing scheme, not ordinary fast hashes.",
        "example": "Verify a downloaded file against a trusted SHA-256 digest.",
        "analysis": "A match provides integrity evidence if the expected digest comes from a trustworthy source.",
        "question": "Should passwords be stored using plain SHA-256 alone?",
        "answer": "No; use a purpose-built password hashing scheme."
      },
      {
        "id": "security-4",
        "title": "Phishing and social engineering",
        "explanation": "Phishing uses deceptive messages to induce disclosure or actions. Verify unexpected requests through a trusted channel, inspect domains, and avoid entering credentials via suspicious links.",
        "example": "A message claims your account will expire unless you sign in immediately.",
        "analysis": "Navigate independently to the official service instead of using the message link.",
        "question": "What is a safe response to an unexpected password request?",
        "answer": "Verify through the official service; never disclose your password."
      },
      {
        "id": "security-5",
        "title": "Secure web applications",
        "explanation": "SQL injection arises when input becomes executable query syntax; parameterized queries separate data from code. XSS executes attacker-controlled content in a browser. Access control must be checked for each protected operation.",
        "example": "Use a parameterized query with a separate user ID value.",
        "analysis": "This avoids interpreting the user ID as SQL syntax. Encode output for its rendering context.",
        "question": "What prevents SQL injection in typical database queries?",
        "answer": "Parameterized queries with appropriate validation."
      }
    ]
  },
  {
    "subject": "Software Engineering",
    "slug": "software",
    "items": [
      {
        "id": "software-1",
        "title": "Software development life cycle",
        "explanation": "SDLC describes activities such as requirements, design, implementation, testing, deployment and maintenance. Iterative approaches revisit these activities as feedback arrives.",
        "example": "A notes app begins with upload and retrieval requirements.",
        "analysis": "Design storage and access controls, implement, test, then deploy and improve.",
        "question": "Why collect requirements before implementation?",
        "answer": "To align the solution with actual user needs."
      },
      {
        "id": "software-2",
        "title": "Requirements and user stories",
        "explanation": "Functional requirements describe behavior; nonfunctional requirements describe qualities or constraints. Acceptance criteria make a requirement testable.",
        "example": "As a learner, I want to save a note so I can find it later.",
        "analysis": "Acceptance: saving an approved note adds it to the signed-in user's library.",
        "question": "Is a two-second response target functional or nonfunctional?",
        "answer": "Nonfunctional, a performance requirement."
      },
      {
        "id": "software-3",
        "title": "Testing strategies",
        "explanation": "Unit tests check small units; integration tests check interactions; end-to-end tests check complete user workflows. Regression tests protect previously working behavior.",
        "example": "Test PDF header validation, then storage integration, then an upload journey.",
        "analysis": "These tests cover different failure modes. Negative cases are as important as success cases.",
        "question": "What does a regression test detect?",
        "answer": "A previously working behavior that breaks after a change."
      },
      {
        "id": "software-4",
        "title": "Version control and collaboration",
        "explanation": "Git records snapshots as commits. Branches allow isolated changes; reviews inspect proposed changes before integration. A good commit isolates a coherent change.",
        "example": "Create a branch, edit a file, commit, open a pull request.",
        "analysis": "Review and test before merging. Never commit credentials.",
        "question": "Why use small commits?",
        "answer": "They simplify review, debugging and rollback."
      },
      {
        "id": "software-5",
        "title": "Software architecture and maintainability",
        "explanation": "Separate concerns into components with clear responsibilities. Coupling describes dependency strength; cohesion describes how related a module's responsibilities are.",
        "example": "Separate UI components, data access and validation.",
        "analysis": "Changing storage implementation should not require rewriting unrelated UI components.",
        "question": "What is high cohesion?",
        "answer": "A module's responsibilities are closely related."
      }
    ]
  },
  {
    "subject": "Cloud Computing",
    "slug": "cloud",
    "items": [
      {
        "id": "cloud-1",
        "title": "Cloud service models",
        "explanation": "IaaS provides infrastructure, PaaS supplies a managed application platform, and SaaS offers complete applications. Responsibility for security varies by model and provider.",
        "example": "A managed database reduces operating-system maintenance.",
        "analysis": "The application owner still controls data permissions, credentials and schema design.",
        "question": "Does managed hosting eliminate application security responsibilities?",
        "answer": "No."
      },
      {
        "id": "cloud-2",
        "title": "Virtualization and containers",
        "explanation": "Virtual machines typically run separate guest operating systems. Containers isolate processes while sharing a host kernel. Images package application dependencies; running containers instantiate images.",
        "example": "A service image includes its runtime and application files.",
        "analysis": "The same image can run in compatible environments; configuration and secrets should be supplied separately.",
        "question": "What is a key difference between containers and VMs?",
        "answer": "Containers generally share the host kernel; VMs run guest kernels."
      },
      {
        "id": "cloud-3",
        "title": "Object storage and databases",
        "explanation": "Object storage holds blobs identified by keys. Databases manage structured records and queries. Keep large PDFs in object storage and metadata in a database.",
        "example": "A notes record stores title, owner and file key.",
        "analysis": "The storage policy must authorize the object; database permissions alone may not protect it.",
        "question": "Where should large PDF bytes usually live?",
        "answer": "Object storage."
      },
      {
        "id": "cloud-4",
        "title": "Scaling and caching",
        "explanation": "Vertical scaling increases resources on one instance; horizontal scaling adds instances. Caches reduce repeated work but can serve stale data. Load balancing distributes traffic.",
        "example": "Cache public static assets with versioned filenames.",
        "analysis": "A new filename avoids stale asset collisions. Private responses require careful cache rules.",
        "question": "What is horizontal scaling?",
        "answer": "Adding more instances to distribute work."
      },
      {
        "id": "cloud-5",
        "title": "Cloud reliability and cost",
        "explanation": "Backups, monitoring and recovery tests improve reliability. Cost drivers include storage, requests, compute and network egress. Free-tier limits are finite and can change.",
        "example": "Track PDF storage and download traffic.",
        "analysis": "Compress appropriate files and monitor usage; avoid deleting backups without a recovery strategy.",
        "question": "Why test a backup restore?",
        "answer": "A backup is only useful if it can be restored successfully."
      }
    ]
  }
];
