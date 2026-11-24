from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.units import inch
from pathlib import Path
from xml.sax.saxutils import escape
OUT=Path(__file__).resolve().parents[1]/'public'/'samples';OUT.mkdir(exist_ok=True)
TOPICS={
'data-structures':('Data Structures - Quick Revision Handbook',[
('1. Why data structures matter',['A data structure organizes data to make operations such as search, insert, update and delete efficient. Select one based on the operations you perform most often.','An array stores elements in indexed order. It supports O(1) access by index but inserting near the beginning often takes O(n) time because elements must shift.']),
('2. Complexity in one minute',['Big-O expresses an upper bound on how running time grows with input size n. Common growth rates: O(1), O(log n), O(n), O(n log n), O(n squared).','A single loop over n items is often O(n). Two sequential loops are usually O(n), not O(n squared). Two nested loops over n items are often O(n squared).']),
('3. Stack and queue',['A stack follows LIFO: last in, first out. Common operations are push, pop and peek. Think undo history or function calls.','A queue follows FIFO: first in, first out. Common operations are enqueue, dequeue and front. Think printer tasks and waiting lines.']),
('4. Linked lists',['A singly linked list stores each element with a pointer to the next node. It supports cheap insertions after a known node but finding the kth item takes O(n).','Doubly linked lists add a previous pointer. They make backward navigation easier but use more memory.']),
('5. Sorting and searching',['Binary search needs sorted data; it repeatedly halves the search interval and takes O(log n) comparisons.','Merge sort divides the list, recursively sorts the halves, then merges them in O(n log n) time. Bubble sort is conceptually simple but typically O(n squared).']),
('6. Self-check',['Explain why binary search fails on an unsorted array.','Compare a stack and queue using one real application each.','If you need frequent indexed reads, why might an array be better than a linked list?'])]),
'dbms':('DBMS - SQL and Normalization Essentials',[
('1. The relational model',['A relational database stores information in tables (relations), with rows (records) and columns (attributes). A schema defines the structure.','A primary key uniquely identifies each row. A foreign key refers to a key in another table and supports referential integrity.']),
('2. Basic SQL',['SELECT title FROM notes WHERE semester = 3; retrieves selected columns matching a condition.','INSERT adds rows; UPDATE changes existing rows; DELETE removes rows. Always test WHERE conditions before modifying important data.']),
('3. Joins',['An INNER JOIN returns rows where the join condition matches on both sides. A LEFT JOIN keeps all left-side rows and fills unmatched right-side values with NULL.','Use meaningful table aliases and explicit ON conditions when joining tables.']),
('4. Normalization',['First normal form (1NF): values are atomic and the table has well-defined rows.','Second normal form (2NF): 1NF plus no non-key attribute depends on only part of a candidate key.','Third normal form (3NF): 2NF plus no transitive dependency of a non-key attribute on a key.']),
('5. Transactions',['ACID refers to Atomicity, Consistency, Isolation and Durability. Transactions group related operations into a reliable unit.','COMMIT saves a transaction; ROLLBACK abandons its uncommitted changes.']),
('6. Practice prompts',['Explain primary keys and foreign keys with a student-enrollment example.','What anomaly may arise if a student address is copied into every enrollment row?','Write a SELECT query that filters by a subject and sorts by title.'])]),
'computer-networks':('Computer Networks - OSI and TCP/IP',[
('1. What a network does',['Computer networks let devices exchange information through wired or wireless links. Protocols define how messages are structured, addressed and transmitted.','Bandwidth is a data transfer capacity, often measured in bits per second. Latency is the time a message takes to travel from sender to receiver.']),
('2. OSI layers',['Application: services used by applications. Presentation: encoding and format. Session: communication sessions.','Transport: end-to-end delivery (TCP or UDP). Network: logical addressing and routing. Data Link: local frame delivery. Physical: bits and signals.']),
('3. TCP/IP model',['The internet protocol suite is often described with Application, Transport, Internet and Link layers. The layers roughly correspond to portions of the OSI reference model.','IP handles addressing and forwarding packets; TCP adds reliable, ordered byte streams; UDP offers lightweight datagrams without the same guarantees.']),
('4. Important protocols',['HTTP and HTTPS are used to transfer web content; HTTPS uses TLS to secure connections. DNS resolves domain names to addresses.','DHCP can automatically assign IP configuration. ICMP supports diagnostic and error messages.']),
('5. Addressing',['An IPv4 address has 32 bits, often written as four decimal octets. An IPv6 address uses 128 bits.','A router forwards packets across different networks, while an Ethernet switch typically forwards frames within a local network.']),
('6. Practice prompts',['Name the seven OSI layers from bottom to top.','Compare TCP and UDP.','Explain bandwidth and latency using video calls as an example.'])]),
'python':('Python - Fundamentals and Cheat Sheet',[
('1. Syntax and values',['Python uses indentation to define code blocks. Common built-in types include int, float, str, bool, list, tuple, dict and set.','Variables refer to objects. Python is dynamically typed; types are associated with values at runtime.']),
('2. Conditions and loops',['if, elif and else select between branches. for iterates over an iterable; while repeats while a condition remains true.','Use range(5) for the integers 0, 1, 2, 3, 4. Use break to exit a loop and continue to skip to its next iteration.']),
('3. Functions',['A function is defined with def and can accept arguments and return values. Return values let code be reused and tested.','Example: def square(n): return n * n. Calling square(4) returns 16.']),
('4. Lists and dictionaries',['Lists are ordered and mutable. They support indexing, slicing and methods such as append and pop.','Dictionaries map keys to values. Use data.get("key") for a safe lookup with a default of None.']),
('5. Comprehensions',['A list comprehension creates a new list concisely: [x*x for x in range(5)] yields [0,1,4,9,16].','A generator expression uses parentheses and computes values lazily instead of constructing a full list immediately.']),
('6. Practice prompts',['Write a function that returns the sum of even numbers in a list.','Explain the difference between a list and a tuple.','What happens when an index does not exist in a list?'])]),
'web-development':('Web Development - HTML CSS and JavaScript',[
('1. What each language does',['HTML gives structure and meaning to content, CSS controls presentation and layout, and JavaScript adds behavior.','Use semantic HTML elements such as header, nav, main, article and footer to make content easier to understand and navigate.']),
('2. Accessible HTML',['Associate input controls with visible labels. Give buttons meaningful text and provide alt text for images conveying information.','Use headings in a meaningful hierarchy, and make interactive elements accessible by keyboard.']),
('3. CSS layouts',['Flexbox arranges items along one main axis and makes alignment straightforward. CSS Grid is useful for two-dimensional rows and columns.','For responsive pages, use relative units, max-width, media queries and layouts that adapt rather than fixed pixel widths.']),
('4. JavaScript basics',['Variables can be declared with let or const. Arrays store ordered collections; objects store named properties.','Use addEventListener to respond to UI events. Avoid injecting untrusted strings into innerHTML.']),
('5. DOM and fetching',['The DOM represents the current document as a tree. querySelector returns the first matching element and textContent updates text safely.','fetch makes network requests. Check response.ok, handle errors and show loading states to the user.']),
('6. Practice prompts',['Create a semantic three-section article with headings.','Explain the difference between CSS flex and grid.','Write a click handler that changes a text label without using innerHTML.'])]),
'operating-systems':('Operating Systems - Exam Revision Notes',[
('1. OS responsibilities',['An operating system coordinates hardware resources and provides services to programs. Key jobs include process scheduling, memory management, devices and files.','A kernel is the privileged core that manages hardware interaction and protected operations.']),
('2. Processes and threads',['A process is a running program with its own resources and address space. Threads are execution paths within a process and can share its memory.','Common process states include new, ready, running, waiting and terminated.']),
('3. CPU scheduling',['First-Come First-Served schedules by arrival order; Round Robin gives each process a time slice.','Shortest Job First can reduce average waiting time when burst times are known, but may starve long processes without protections.']),
('4. Memory management',['Virtual memory lets programs work with virtual addresses translated to physical memory. Paging divides memory into fixed-size pages and frames.','Page faults occur when a required page is not currently mapped to available memory and must be handled by the OS.']),
('5. Deadlocks and file systems',['A deadlock is a situation where processes wait indefinitely for resources held by one another. Conditions include mutual exclusion, hold-and-wait, no preemption and circular wait.','File systems organize file names, directories, permissions and data blocks on storage devices.']),
('6. Practice prompts',['Contrast a process with a thread.','Compare FCFS and Round Robin scheduling.','Explain what causes a page fault.'])])
}
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='TitleCustom',fontName='Helvetica-Bold',fontSize=25,leading=30,textColor=HexColor('#30283B'),spaceAfter=20))
styles.add(ParagraphStyle(name='SectionCustom',fontName='Helvetica-Bold',fontSize=14.5,leading=18,textColor=HexColor('#7654AB'),spaceBefore=16,spaceAfter=7))
styles.add(ParagraphStyle(name='BodyCustom',fontName='Helvetica',fontSize=10.8,leading=17,textColor=HexColor('#3D3746'),spaceAfter=10))
styles.add(ParagraphStyle(name='SmallCustom',fontName='Helvetica',fontSize=9,leading=14,textColor=HexColor('#6B6570'),spaceAfter=7))
def footer(canvas, doc):
 canvas.saveState();w,h=doc.pagesize
 canvas.setStrokeColor(HexColor('#DDD2E9'));canvas.line(50,55,w-50,55)
 canvas.setFont('Helvetica',8);canvas.setFillColor(HexColor('#7A7082'))
 canvas.drawString(50,42,'NOTESHUB / FREE ORIGINAL STUDY NOTES')
 canvas.drawRightString(w-50,42,f'{doc.page}')
 canvas.restoreState()
for slug,(title,sections) in TOPICS.items():
 path=OUT/f'{slug}.pdf'
 doc=SimpleDocTemplate(str(path),pagesize=(612,792),rightMargin=55,leftMargin=55,topMargin=55,bottomMargin=72)
 story=[Paragraph('✳ NOTESHUB STUDY LIBRARY'.replace('✳ ','').upper(),styles['SmallCustom']),Spacer(1,12),Paragraph(escape(title),styles['TitleCustom']),Paragraph('Original introductory revision material. Use alongside your official syllabus and course texts.',styles['SmallCustom']),Spacer(1,12)]
 for heading,paragraphs in sections:
  story.append(Paragraph(escape(heading),styles['SectionCustom']))
  for p in paragraphs:story.append(Paragraph(escape(p),styles['BodyCustom']))
 story.extend([Spacer(1,15),Paragraph('Share this original NotesHub starter guide freely with attribution. Verify technical details for your syllabus; this is a concise learning aid.',styles['SmallCustom'])])
 doc.build(story,onFirstPage=footer,onLaterPages=footer)
 print(path.name,path.stat().st_size)