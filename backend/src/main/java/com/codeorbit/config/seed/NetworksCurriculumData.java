package com.codeorbit.config.seed;

import com.codeorbit.entity.*;
import org.springframework.stereotype.Component;

@Component
public class NetworksCurriculumData {

    private final CurriculumSeedHelper helper;

    public NetworksCurriculumData(CurriculumSeedHelper helper) {
        this.helper = helper;
    }

    public void seedNetworksCurriculum(Course netCourse) {
        // ==========================================
        // LEVEL 1: BEGINNER (FREE)
        // ==========================================
        Subcourse netBeginner = helper.createSubcourse(
                netCourse, CurriculumLevel.BEGINNER, "Computer Networks — Beginner Foundations", "cn-beginner",
                "OSI 7-layer model, TCP/IP protocol suite, physical topologies, MAC addressing, and IP addressing.", 0, true, 1
        );

        // Mod 1: OSI vs TCP/IP Architecture
        CourseModule bMod1 = helper.createModule(netCourse, netBeginner, CurriculumLevel.BEGINNER,
                "Module 1: Network Architectures & Layered Models", "cn-b-mod1-osi-tcpip",
                "OSI 7 Layers vs TCP/IP 4/5 Layers, Protocol Data Units (PDUs), Encapsulation & Decapsulation.", 1);
        helper.createLesson(bMod1, "1.1 OSI 7-Layer Reference Model & Data Encapsulation", "cn-osi-layers-and-encapsulation", 15, 1,
                "# OSI 7-Layer Reference Model\n\n* **Layer 7: Application** (HTTP, DNS, SMTP, FTP) - Data\n* **Layer 6: Presentation** (TLS, SSL, JPEG, ASCII) - Data\n* **Layer 5: Session** (RPC, NetBIOS) - Data\n* **Layer 4: Transport** (TCP, UDP) - Segments / Datagrams\n* **Layer 3: Network** (IPv4, IPv6, ICMP) - Packets\n* **Layer 2: Data Link** (Ethernet, Wi-Fi, MAC) - Frames\n* **Layer 1: Physical** (Cables, Fiber, Signals) - Bits",
                "# OSI 7 Layers aur Data Encapsulation\n\nOSI ke 7 layers aur data kaise Application layer se Physical layer tak encapsulate hota hai.",
                "public class NetworkLayerPdu {\n    public static void printLayer(String layer, String pdu) {\n        System.out.println(\"Layer: \" + layer + \", PDU: \" + pdu);\n    }\n}",
                "#include <iostream>\nvoid printPdu() {\n    std::cout << \"Transport -> Segment, Network -> Packet, Data Link -> Frame\\n\";\n}",
                "def get_layer_pdu(layer_name):\n    pdus = {'Transport': 'Segment', 'Network': 'Packet', 'Data Link': 'Frame', 'Physical': 'Bits'}\n    return pdus.get(layer_name, 'Data')"
        );
        helper.createLesson(bMod1, "1.2 TCP/IP Protocol Architecture", "cn-tcpip-model-architecture", 20, 2,
                "# TCP/IP 4-Layer Model\n\n* **Application Layer**: Combines OSI Application, Presentation, and Session layers.\n* **Transport Layer**: End-to-end communication and reliability (TCP/UDP).\n* **Internet Layer**: Host addressing, routing, and packet forwarding (IP, ICMP, ARP).\n* **Network Access / Link Layer**: Physical hardware framing and transmission.",
                "# TCP/IP 4 Layer Architecture\n\nModern Internet ka foundation TCP/IP protocol suite kaise organize hota hai.",
                "import java.net.InetAddress;\n\npublic class IpLookup {\n    public static void main(String[] args) throws Exception {\n        InetAddress addr = InetAddress.getByName(\"codeorbit.online\");\n        System.out.println(\"Resolved IP: \" + addr.getHostAddress());\n    }\n}",
                "#include <arpa/inet.h>\n#include <stdio.h>\n\nvoid printIp() {\n    struct in_addr addr;\n    inet_aton(\"192.168.1.1\", &addr);\n}",
                "import socket\n\ndef resolve_hostname(host):\n    return socket.gethostbyname(host)"
        );
        Quiz bQ1 = helper.createModuleQuiz(bMod1, netBeginner, CurriculumLevel.BEGINNER,
                "Module 1 Assessment: OSI & TCP/IP Architecture", "cn-b-mod1-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(bQ1, "OSI & TCP/IP");

        // Mod 2: Physical & Data Link Layer
        CourseModule bMod2 = helper.createModule(netCourse, netBeginner, CurriculumLevel.BEGINNER,
                "Module 2: Data Link Layer & Framing", "cn-b-mod2-data-link",
                "Framing (Bit Stuffing, Byte Stuffing), Error Detection (CRC, Checksum, Parity), and MAC addressing.", 2);
        helper.createLesson(bMod2, "2.1 Error Detection: Cyclic Redundancy Check (CRC)", "cn-crc-error-detection", 20, 1,
                "# Cyclic Redundancy Check (CRC) Error Detection\n\nCRC uses polynomial modulo-2 arithmetic (XOR addition/subtraction) to generate an FCS (Frame Check Sequence):\n1. Append $k$ zeros to the data block (where $k$ is the degree of generator polynomial $G(x)$).\n2. Perform binary polynomial division.\n3. The remainder $R(x)$ becomes the CRC checksum appended to the transmitted frame.",
                "# CRC Error Detection\n\nData link layer me bits corrupt hone se detect karne ke liye Cyclic Redundancy Check (CRC) algorithm.",
                "public class Crc32Calculator {\n    public static long calculateCrc(byte[] data) {\n        java.util.zip.CRC32 crc = new java.util.zip.CRC32();\n        crc.update(data);\n        return crc.getValue();\n    }\n}",
                "// C++ CRC32 standard calculation\n#include <vector>\nuint32_t computeCRC(const std::vector<uint8_t>& data) {\n    uint32_t crc = 0xFFFFFFFF;\n    for(uint8_t b : data) { crc ^= b; for(int i=0; i<8; ++i) crc = (crc >> 1) ^ (0xEDB88320 & -(crc & 1)); }\n    return ~crc;\n}",
                "import zlib\n\ndef calculate_crc32(data_bytes):\n    return zlib.crc32(data_bytes)"
        );
        Quiz bQ2 = helper.createModuleQuiz(bMod2, netBeginner, CurriculumLevel.BEGINNER,
                "Module 2 Assessment: Data Link & CRC", "cn-b-mod2-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(bQ2, "Data Link & CRC");

        // Mod 3: IP Addressing & Subnetting
        CourseModule bMod3 = helper.createModule(netCourse, netBeginner, CurriculumLevel.BEGINNER,
                "Module 3: IPv4 Addressing & CIDR Subnetting", "cn-b-mod3-ipv4-subnetting",
                "Classful Addressing (Classes A, B, C, D, E), CIDR (Classless Inter-Domain Routing), Subnet Masks, and VLSM.", 3);
        helper.createLesson(bMod3, "3.1 CIDR Subnetting & Network Calculation", "cn-cidr-subnet-calculation", 25, 1,
                "# CIDR Subnetting & Network Calculation\n\nIn `/24` CIDR notation (e.g. `192.168.1.0/24`):\n* Subnet Mask: `255.255.255.0` (24 network bits, 8 host bits).\n* Total IP Addresses: $2^8 = 256$.\n* Usable Host Addresses: $2^8 - 2 = 254$ (excluding Network ID `.0` and Broadcast Address `.255`).",
                "# CIDR Subnetting aur Subnet Mask\n\nClassless Inter-Domain Routing (CIDR), network address, broadcast address aur usable hosts calculate karna.",
                "public class SubnetCalculator {\n    public static int getUsableHosts(int prefixLength) {\n        int hostBits = 32 - prefixLength;\n        return (int) Math.pow(2, hostBits) - 2;\n    }\n}",
                "int computeUsableHosts(int cidrPrefix) {\n    return (1 << (32 - cidrPrefix)) - 2;\n}",
                "def usable_hosts(cidr_prefix):\n    return (2 ** (32 - cidr_prefix)) - 2"
        );
        Quiz bQ3 = helper.createModuleQuiz(bMod3, netBeginner, CurriculumLevel.BEGINNER,
                "Module 3 Assessment: IPv4 & CIDR Subnetting", "cn-b-mod3-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(bQ3, "IPv4 & CIDR Subnetting");

        // Mod 4: Media Access Control (MAC) & Ethernet
        CourseModule bMod4 = helper.createModule(netCourse, netBeginner, CurriculumLevel.BEGINNER,
                "Module 4: Medium Access Control & Ethernet", "cn-b-mod4-ethernet-mac",
                "ALOHA (Pure vs Slotted), CSMA/CD (Carrier Sense Multiple Access with Collision Detection), CSMA/CA, and ARP protocol.", 4);
        helper.createLesson(bMod4, "4.1 CSMA/CD & Address Resolution Protocol (ARP)", "cn-csmacd-and-arp", 20, 1,
                "# CSMA/CD and ARP Protocol\n\n* **CSMA/CD**: Used in half-duplex Ethernet. Listen before transmitting; if a collision is detected during transmission, send a Jam signal and apply Binary Exponential Backoff.\n* **ARP (Address Resolution Protocol)**: Maps a known 32-bit IPv4 address to a 48-bit physical MAC address on the local link.",
                "# CSMA/CD aur ARP Protocol\n\nEthernet collision detection (CSMA/CD) aur IP se MAC address resolve karne ke liye ARP broadcast request.",
                "public class ArpConcept {\n    // ARP Request: Broadcast (FF:FF:FF:FF:FF:FF) -> ARP Reply: Unicast\n}",
                "// C++ ARP concept comment\n// ARP resolves IP (L3) to MAC (L2)",
                "def format_mac(bytes_seq):\n    return ':'.join(f'{b:02x}' for b in bytes_seq)"
        );
        Quiz bQ4 = helper.createModuleQuiz(bMod4, netBeginner, CurriculumLevel.BEGINNER,
                "Module 4 Assessment: Ethernet, CSMA/CD & ARP", "cn-b-mod4-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(bQ4, "Ethernet, CSMA/CD & ARP");

        // Final Quiz: Beginner
        Quiz bFinalQuiz = helper.createFinalQuiz(bMod4, netBeginner, CurriculumLevel.BEGINNER,
                "Computer Networks Beginner Level Final Certification Quiz", "cn-beginner-final-quiz", "25 Questions, 80% passing threshold.", 80);
        seedTwentyFiveQuestions(bFinalQuiz, "Networks Beginner Foundations");

        // ==========================================
        // LEVEL 2: INTERMEDIATE (FREE)
        // ==========================================
        Subcourse netIntermediate = helper.createSubcourse(
                netCourse, CurriculumLevel.INTERMEDIATE, "Computer Networks — Intermediate Protocols", "cn-intermediate",
                "Routing algorithms (Dijkstra/Distance Vector), Transport layer (TCP/UDP), TCP 3-way handshake, and Flow Control.", 0, true, 2
        );

        // Mod 1: Routing Algorithms
        CourseModule iMod1 = helper.createModule(netCourse, netIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 1: Unicast Routing Algorithms & Protocols", "cn-i-mod1-routing",
                "Distance Vector Routing (Bellman-Ford, Count-to-Infinity problem), Link State Routing (Dijkstra, OSPF), and BGP.", 1);
        helper.createLesson(iMod1, "1.1 Link State Routing & Distance Vector Routing", "cn-routing-dijkstra-and-bellman-ford", 25, 1,
                "# Routing Algorithms: Link State vs Distance Vector\n\n* **Link State (OSPF)**: Every node floods topology state to all routers; each router independently computes shortest path trees using Dijkstra's algorithm.\n* **Distance Vector (RIP)**: Routers periodically exchange routing tables with immediate neighbors using Bellman-Ford equation $D_x(y) = \\min_v \\{ c(x, v) + D_v(y) \\}$.",
                "# Routing Algorithms: OSPF aur Distance Vector\n\nLink State (Dijkstra) aur Distance Vector (Bellman-Ford) routing protocols ka comparison.",
                "import java.util.*;\n\npublic class DijkstraRouting {\n    public static int[] shortestPath(int[][] graph, int src) {\n        int n = graph.length;\n        int[] dist = new int[n];\n        Arrays.fill(dist, Integer.MAX_VALUE);\n        dist[src] = 0;\n        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));\n        pq.add(new int[]{src, 0});\n        while (!pq.isEmpty()) {\n            int[] cur = pq.poll();\n            int u = cur[0], d = cur[1];\n            if (d > dist[u]) continue;\n            for (int v = 0; v < n; v++) {\n                if (graph[u][v] > 0 && dist[u] + graph[u][v] < dist[v]) {\n                    dist[v] = dist[u] + graph[u][v];\n                    pq.add(new int[]{v, dist[v]});\n                }\n            }\n        }\n        return dist;\n    }\n}",
                "// C++ Dijkstra routing\n#include <vector>\n#include <queue>\nstd::vector<int> dijkstra(int n, int src, const std::vector<std::vector<std::pair<int,int>>>& adj) {\n    std::vector<int> dist(n, 1e9);\n    dist[src] = 0;\n    std::priority_queue<std::pair<int,int>, std::vector<std::pair<int,int>>, std::greater<>> pq;\n    pq.push({0, src});\n    while(!pq.empty()) {\n        auto [d, u] = pq.top(); pq.pop();\n        if(d > dist[u]) continue;\n        for(auto& [v, w] : adj[u]) {\n            if(dist[u] + w < dist[v]) { dist[v] = dist[u] + w; pq.push({dist[v], v}); }\n        }\n    }\n    return dist;\n}",
                "import heapq\n\ndef dijkstra(n, graph, src):\n    dist = [float('inf')] * n\n    dist[src] = 0\n    pq = [(0, src)]\n    while pq:\n        d, u = heapq.heappop(pq)\n        if d > dist[u]: continue\n        for v, w in graph[u]:\n            if dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n                heapq.heappush(pq, (dist[v], v))\n    return dist"
        );
        Quiz iQ1 = helper.createModuleQuiz(iMod1, netIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 1 Assessment: Routing Protocols", "cn-i-mod1-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(iQ1, "Routing Protocols (OSPF, RIP, BGP)");

        // Mod 2: Transport Layer (TCP vs UDP)
        CourseModule iMod2 = helper.createModule(netCourse, netIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 2: Transport Layer & TCP vs UDP", "cn-i-mod2-tcp-udp",
                "TCP Header format, UDP Header format, Port multiplexing, Checksum, and TCP 3-Way Handshake / 4-Way Teardown.", 2);
        helper.createLesson(iMod2, "2.1 TCP 3-Way Handshake & Connection Teardown", "cn-tcp-handshake-and-teardown", 20, 1,
                "# TCP 3-Way Handshake & Connection Lifecycle\n\n1. **SYN**: Client sends `SYN = 1`, `Seq = x` (State: `SYN_SENT`).\n2. **SYN-ACK**: Server sends `SYN = 1`, `ACK = 1`, `Seq = y`, `Ack = x + 1` (State: `SYN_RCVD`).\n3. **ACK**: Client sends `ACK = 1`, `Seq = x + 1`, `Ack = y + 1` (State: `ESTABLISHED`).\n\n### 4-Way Teardown & TIME_WAIT\nThe initiating client enters `TIME_WAIT` for $2 \\times MSL$ (Maximum Segment Lifetime) to ensure the final ACK is received by the peer and stray segments expire in the network.",
                "# TCP 3-Way Handshake aur TIME_WAIT\n\nTCP connection setup (SYN, SYN-ACK, ACK) aur teardown me TIME_WAIT state ka role.",
                "import java.net.Socket;\n\npublic class TcpClientConnect {\n    public static void main(String[] args) throws Exception {\n        try (Socket socket = new Socket(\"localhost\", 8080)) {\n            System.out.println(\"TCP 3-Way Handshake completed; connection established.\");\n        }\n    }\n}",
                "// C++ Socket connect initiates TCP 3-way handshake\n#include <sys/socket.h>\n#include <netinet/in.h>\n\nint connectToServer() {\n    int sock = socket(AF_INET, SOCK_STREAM, 0);\n    return sock;\n}",
                "import socket\n\ndef create_tcp_client():\n    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n    return s"
        );
        Quiz iQ2 = helper.createModuleQuiz(iMod2, netIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 2 Assessment: TCP vs UDP & Handshakes", "cn-i-mod2-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(iQ2, "TCP vs UDP & Handshake");

        // Mod 3: Flow Control (Sliding Window)
        CourseModule iMod3 = helper.createModule(netCourse, netIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 3: Flow Control & Sliding Window Protocols", "cn-i-mod3-flow-control",
                "Stop-and-Wait, Go-Back-N (GBN), Selective Repeat (SR), Window Size mathematical limits ($2^n - 1$ vs $2^{n-1}$).", 3);
        helper.createLesson(iMod3, "3.1 Go-Back-N vs Selective Repeat Protocols", "cn-gobackn-and-selective-repeat", 25, 1,
                "# Sliding Window Protocols: GBN vs SR\n\n* **Stop-and-Wait**: Sender window = 1, Receiver window = 1; low channel efficiency $\\eta = \\frac{1}{1 + 2a}$.\n* **Go-Back-N (GBN)**: Sender window $= N$, Receiver window $= 1$. Discards out-of-order packets; requires cumulative ACKs. Maximum window size with $k$-bit sequence numbers is $2^k - 1$.\n* **Selective Repeat (SR)**: Sender window $= 2^{k-1}$, Receiver window $= 2^{k-1}$. Buffers out-of-order packets and retransmits only lost packets with individual ACKs.",
                "# Go-Back-N aur Selective Repeat\n\nSliding window flow control protocols me sender/receiver window size formula aur retransmission rules.",
                "public class SlidingWindowMath {\n    public static int maxGbnWindow(int bits) { return (1 << bits) - 1; }\n    public static int maxSrWindow(int bits) { return 1 << (bits - 1); }\n}",
                "int maxGbn(int seqBits) { return (1 << seqBits) - 1; }\nint maxSr(int seqBits) { return 1 << (seqBits - 1); }",
                "def sliding_window_bounds(seq_bits):\n    return {'gbn': (2**seq_bits) - 1, 'sr': 2**(seq_bits - 1)}"
        );
        Quiz iQ3 = helper.createModuleQuiz(iMod3, netIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 3 Assessment: Flow Control & Sliding Window", "cn-i-mod3-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(iQ3, "Flow Control & Sliding Window");

        // Mod 4: TCP Congestion Control
        CourseModule iMod4 = helper.createModule(netCourse, netIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 4: TCP Congestion Control & Avoidance", "cn-i-mod4-congestion-control",
                "Slow Start, Congestion Avoidance, Fast Retransmit (3 Duplicate ACKs), Fast Recovery, and TCP Tahoe vs Reno vs BBR.", 4);
        helper.createLesson(iMod4, "4.1 Slow Start, Congestion Avoidance & Fast Retransmit", "cn-tcp-congestion-control-algorithms", 25, 1,
                "# TCP Congestion Control Algorithms\n\n* **Slow Start**: Congestion Window (`cwnd`) starts at 1 MSS and doubles every RTT ($cwnd \\leftarrow cwnd \\times 2$) until reaching `ssthresh`.\n* **Congestion Avoidance**: When $cwnd \\ge ssthresh$, increases linearly by 1 MSS per RTT (AIMD: Additive Increase Multiplicative Decrease).\n* **Loss Detection**:\n  * **Timeout**: Reset $ssthresh = cwnd / 2$, set $cwnd = 1$ MSS (Tahoe & Reno).\n  * **3 Duplicate ACKs (Fast Retransmit)**: Set $ssthresh = cwnd / 2$, set $cwnd = ssthresh + 3$ (Reno Fast Recovery).",
                "# TCP Congestion Control: Slow Start aur AIMD\n\nSlow start exponential growth, congestion avoidance linear growth aur 3 duplicate ACKs par Fast Retransmit.",
                "public class CongestionWindowSimulation {\n    public static int nextCwnd(int cwnd, int ssthresh, boolean isDupAck3, boolean isTimeout) {\n        if (isTimeout) return 1;\n        if (isDupAck3) return cwnd / 2;\n        if (cwnd < ssthresh) return cwnd * 2;\n        return cwnd + 1;\n    }\n}",
                "// C++ Congestion Window logic\nint updateCwnd(int cwnd, int ssthresh, bool loss) {\n    if (loss) return 1;\n    return (cwnd < ssthresh) ? cwnd * 2 : cwnd + 1;\n}",
                "def simulate_cwnd(cwnd, ssthresh, loss_event):\n    if loss_event == 'TIMEOUT': return 1, cwnd // 2\n    elif loss_event == '3_DUP_ACK': return (cwnd // 2) + 3, cwnd // 2\n    elif cwnd < ssthresh: return cwnd * 2, ssthresh\n    return cwnd + 1, ssthresh"
        );
        Quiz iQ4 = helper.createModuleQuiz(iMod4, netIntermediate, CurriculumLevel.INTERMEDIATE,
                "Module 4 Assessment: TCP Congestion Control", "cn-i-mod4-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(iQ4, "TCP Congestion Control");

        // Final Quiz: Intermediate
        Quiz iFinalQuiz = helper.createFinalQuiz(iMod4, netIntermediate, CurriculumLevel.INTERMEDIATE,
                "Computer Networks Intermediate Level Final Certification Quiz", "cn-intermediate-final-quiz", "25 Questions, 80% passing threshold.", 80);
        seedTwentyFiveQuestions(iFinalQuiz, "Networks Intermediate Protocols");

        // ==========================================
        // LEVEL 3: ADVANCED (FREE)
        // ==========================================
        Subcourse netAdvanced = helper.createSubcourse(
                netCourse, CurriculumLevel.ADVANCED, "Computer Networks — Advanced Architecture & Security", "cn-advanced",
                "Application layer protocols (HTTP/1.1, HTTP/2, HTTP/3 QUIC, DNS, WebSockets), TLS 1.3 encryption, and Network Security.", 0, true, 3
        );

        // Mod 1: Application Layer & DNS
        CourseModule aMod1 = helper.createModule(netCourse, netAdvanced, CurriculumLevel.ADVANCED,
                "Module 1: Application Layer Protocols & DNS Architecture", "cn-a-mod1-dns-application",
                "Domain Name System (DNS) recursive vs iterative queries, Resource Records (A, AAAA, CNAME, MX, TXT), and DNS caching.", 1);
        helper.createLesson(aMod1, "1.1 DNS Resolution Architecture & Record Types", "cn-dns-resolution-internals", 20, 1,
                "# Domain Name System (DNS) Resolution\n\n* **Root Name Servers (`.` )** -> **TLD Name Servers (`.com`)** -> **Authoritative Name Servers (`codeorbit.online`)**.\n* **Recursive Query**: Resolver does all legwork for the client.\n* **Iterative Query**: Server returns referral address to next nameserver.",
                "# DNS Resolution Architecture\n\nDNS recursive vs iterative resolution flow aur DNS record types (A, AAAA, CNAME, MX).",
                "import javax.naming.directory.InitialDirContext;\nimport javax.naming.directory.Attributes;\n\npublic class DnsQuery {\n    public static void lookup() throws Exception {\n        InitialDirContext ctx = new InitialDirContext();\n        Attributes attrs = ctx.getAttributes(\"dns:/codeorbit.online\", new String[]{\"A\"});\n    }\n}",
                "// C++ DNS getaddrinfo\n#include <netdb.h>\nvoid queryDns(const char* host) {\n    struct addrinfo hints{}, *res;\n    hints.ai_family = AF_INET;\n    getaddrinfo(host, \"80\", &hints, &res);\n}",
                "import dns.resolver\n\ndef query_a_record(domain):\n    # Query A record using dnspython\n    pass"
        );
        Quiz aQ1 = helper.createModuleQuiz(aMod1, netAdvanced, CurriculumLevel.ADVANCED,
                "Module 1 Assessment: DNS & Application Protocols", "cn-a-mod1-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(aQ1, "DNS & Application Protocols");

        // Mod 2: HTTP Evolution & QUIC
        CourseModule aMod2 = helper.createModule(netCourse, netAdvanced, CurriculumLevel.ADVANCED,
                "Module 2: HTTP Evolution (HTTP/1.1, HTTP/2, HTTP/3 QUIC)", "cn-a-mod2-http-evolution",
                "HTTP/1.1 Keep-Alive, HTTP/2 Binary Framing & Multiplexing (HOL Blocking at TCP layer), and HTTP/3 QUIC over UDP.", 2);
        helper.createLesson(aMod2, "2.1 HTTP/2 vs HTTP/3 (QUIC over UDP)", "cn-http2-vs-http3-quic", 25, 1,
                "# HTTP/1.1 vs HTTP/2 vs HTTP/3\n\n* **HTTP/1.1**: Text-based, persistent connections, suffers from Application-layer Head-of-Line (HoL) blocking.\n* **HTTP/2**: Binary framing layer, stream multiplexing over a single TCP connection, HPACK header compression. Still suffers from Transport-layer HoL blocking if a single packet drops.\n* **HTTP/3 (QUIC)**: Runs over UDP, integrates TLS 1.3 handshake, zero-RTT connection resumption, and independent stream delivery eliminating all HoL blocking.",
                "# HTTP/2 vs HTTP/3 QUIC\n\nHTTP/2 binary multiplexing aur HTTP/3 ka UDP/QUIC based zero-RTT connection architecture.",
                "import java.net.http.HttpClient;\nimport java.net.http.HttpRequest;\nimport java.net.http.HttpResponse;\nimport java.net.URI;\n\npublic class Http2ClientDemo {\n    public static void send() throws Exception {\n        HttpClient client = HttpClient.newBuilder().version(HttpClient.Version.HTTP_2).build();\n        HttpRequest req = HttpRequest.newBuilder().uri(URI.create(\"https://www.codeorbit.online\")).build();\n        HttpResponse<String> resp = client.send(req, HttpResponse.BodyHandlers.ofString());\n    }\n}",
                "// C++ HTTP/3 QUIC client initialization\n// Connects using QUIC datagrams over UDP port 443",
                "import httpx\n\ndef fetch_http2():\n    client = httpx.Client(http2=True)\n    return client.get('https://www.codeorbit.online')"
        );
        Quiz aQ2 = helper.createModuleQuiz(aMod2, netAdvanced, CurriculumLevel.ADVANCED,
                "Module 2 Assessment: HTTP Evolution & QUIC", "cn-a-mod2-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(aQ2, "HTTP/1.1, HTTP/2 & HTTP/3 QUIC");

        // Mod 3: Cryptography & TLS 1.3
        CourseModule aMod3 = helper.createModule(netCourse, netAdvanced, CurriculumLevel.ADVANCED,
                "Module 3: Cryptography, SSL/TLS 1.3 & PKI", "cn-a-mod3-tls-security",
                "Symmetric vs Asymmetric Encryption, Diffie-Hellman Key Exchange, RSA, Digital Signatures, and TLS 1.3 1-RTT Handshake.", 3);
        helper.createLesson(aMod3, "3.1 TLS 1.3 Handshake & Diffie-Hellman Key Exchange", "cn-tls13-handshake-and-dh", 25, 1,
                "# TLS 1.3 Handshake Architecture\n\nTLS 1.3 reduces handshake latency from 2-RTT (in TLS 1.2) to **1-RTT** (and 0-RTT on resumption):\n1. **ClientHello**: Sends supported cipher suites + Ephemeral Diffie-Hellman Key Share ($g^a \\pmod p$).\n2. **ServerHello**: Sends selected cipher suite + Server Key Share ($g^b \\pmod p$) + Encrypted Certificate + Finished.\n3. Both parties compute shared secret $g^{ab} \\pmod p$ and begin sending encrypted application data immediately.",
                "# TLS 1.3 Handshake aur Cryptography\n\nTLS 1.3 me 1-RTT handshake aur Ephemeral Diffie-Hellman key exchange ka execution.",
                "import javax.net.ssl.SSLContext;\n\npublic class TlsVersionCheck {\n    public static void check() throws Exception {\n        SSLContext context = SSLContext.getInstance(\"TLSv1.3\");\n        context.init(null, null, null);\n    }\n}",
                "// OpenSSL TLS 1.3 context\n#include <openssl/ssl.h>\nvoid initTls() {\n    const SSL_METHOD* method = TLS_client_method();\n    SSL_CTX* ctx = SSL_CTX_new(method);\n    SSL_CTX_set_min_proto_version(ctx, TLS1_3_VERSION);\n}",
                "import ssl\n\ndef get_tls13_context():\n    ctx = ssl.create_default_context()\n    ctx.minimum_version = ssl.TLSVersion.TLSv1_3\n    return ctx"
        );
        Quiz aQ3 = helper.createModuleQuiz(aMod3, netAdvanced, CurriculumLevel.ADVANCED,
                "Module 3 Assessment: TLS 1.3 & Network Security", "cn-a-mod3-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(aQ3, "TLS 1.3 & Network Security");

        // Mod 4: Firewalls, NAT & CDN Architecture
        CourseModule aMod4 = helper.createModule(netCourse, netAdvanced, CurriculumLevel.ADVANCED,
                "Module 4: NAT, Firewalls, Proxies & CDN Infrastructure", "cn-a-mod4-nat-cdn",
                "NAT/PAT (Port Address Translation), Reverse Proxies vs Forward Proxies, WebSockets, Anycast Routing, and Edge CDNs.", 4);
        helper.createLesson(aMod4, "4.1 CDN Edge Caching & Anycast Routing", "cn-cdn-anycast-and-reverse-proxies", 25, 1,
                "# Content Delivery Networks (CDNs) & Anycast\n\n* **Anycast BGP Routing**: Multiple geographically distributed edge servers advertise the exact same IP address. Routers automatically direct user requests to the topologically nearest point of presence (PoP).\n* **Reverse Proxy**: Shields origin servers, provides SSL termination, load balancing, and edge caching.",
                "# CDN Caching, Anycast aur Reverse Proxies\n\nCloudflare/Fastly jaise CDNs Anycast routing aur edge caching se latency kaise drop karte hain.",
                "public class CdnHeaderConstants {\n    public static final String CACHE_CONTROL = \"public, max-age=31536000, immutable\";\n}",
                "// C++ CDN proxy concept\nconst char* edgeCache = \"Cache-Control: public, s-maxage=3600\";",
                "def cdn_cache_headers():\n    return {'Cache-Control': 'public, max-age=86400, s-maxage=604800'}"
        );
        Quiz aQ4 = helper.createModuleQuiz(aMod4, netAdvanced, CurriculumLevel.ADVANCED,
                "Module 4 Assessment: NAT, Firewalls & CDNs", "cn-a-mod4-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(aQ4, "NAT, Firewalls & CDNs");

        // Final Quiz: Advanced
        Quiz aFinalQuiz = helper.createFinalQuiz(aMod4, netAdvanced, CurriculumLevel.ADVANCED,
                "Computer Networks Advanced Level Final Certification Quiz", "cn-advanced-final-quiz", "25 Questions, 80% passing threshold.", 80);
        seedTwentyFiveQuestions(aFinalQuiz, "Networks Advanced Architecture");

        // ==========================================
        // LEVEL 4: PLACEMENT READY (₹29 PAID)
        // ==========================================
        Subcourse netPlacement = helper.createSubcourse(
                netCourse, CurriculumLevel.PLACEMENT_READY, "Computer Networks — Placement Preparation", "cn-placement",
                "Top FAANG/Tier-1 interview question bank, real-world network packet analysis (Wireshark), socket programming, and design.", 29, false, 4
        );

        CourseModule pMod1 = helper.createModule(netCourse, netPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 1: Top 50 Network Interview Questions & Deep Dives", "cn-p-mod1-top-questions",
                "What happens when you type a URL into a browser? TCP vs UDP trade-offs, MTU vs MSS, and SYN flood attacks.", 1);
        helper.createLesson(pMod1, "1.1 URL to Render: The Complete Full-Stack Network Journey", "cn-what-happens-when-you-type-url", 30, 1,
                "# What Happens When You Type a URL in Browser?\n\n1. **URL Parsing & HSTS Check**: Browser checks local HSTS list for HTTPS upgrade.\n2. **DNS Resolution**: Checks browser cache -> OS cache -> `/etc/hosts` -> Local DNS resolver -> Root/TLD/Authoritative nameservers.\n3. **TCP Connection**: 3-Way Handshake (`SYN`, `SYN-ACK`, `ACK`).\n4. **TLS Handshake**: TLS 1.3 Key Exchange, Certificate Validation, Session Secret derivation.\n5. **HTTP Request & Response**: Client transmits HTTP/2 GET request over TLS socket.\n6. **Browser Rendering**: DOM & CSSOM construction, Layout tree, Paint, Compositing.",
                "# URL se Render tak ka Complete Network Flow\n\nInterview question: 'What happens when you type a URL in browser?' ka step-by-step complete breakdown.",
                "public class UrlJourneyOverview {\n    // DNS -> TCP Handshake -> TLS 1.3 -> HTTP Request -> Edge CDN -> Origin DB -> Response -> DOM\n}",
                "// C++ Socket full-flow concept\n// 1. getaddrinfo -> 2. socket() -> 3. connect() -> 4. SSL_connect() -> 5. write() -> 6. read()",
                "def url_flow_summary():\n    return ['DNS', 'TCP', 'TLS', 'HTTP', 'DOM']"
        );
        Quiz pQ1 = helper.createModuleQuiz(pMod1, netPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 1 Assessment: Top Network Interview Questions", "cn-p-mod1-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(pQ1, "Network Top Interview Bank");

        CourseModule pMod2 = helper.createModule(netCourse, netPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 2: Wireshark Packet Analysis & Debugging", "cn-p-mod2-wireshark-debugging",
                "Inspecting TCP flags (SYN, ACK, FIN, RST), diagnosing packet retransmissions, zero-window probes, and MTU black holes.", 2);
        helper.createLesson(pMod2, "2.1 Wireshark Diagnostics & TCP Retransmission Analysis", "cn-wireshark-tcp-diagnostics", 25, 1,
                "# Wireshark Production Debugging\n\n* **TCP Retransmission**: Triggered when ACK is not received within RTO timer.\n* **TCP Dup ACK**: Indicates out-of-order segment arrival at receiver.\n* **TCP Zero Window**: Receiver's receive buffer is full; sender must throttle transmissions until Window Update is sent.",
                "# Wireshark Packet Analysis\n\nProduction servers par packet drops, retransmissions aur TCP zero window issues diagnose karna.",
                "public class PacketInspection {\n    public static void inspect() {\n        System.out.println(\"Wireshark filters: tcp.analysis.retransmission, tcp.flags.reset == 1\");\n    }\n}",
                "// C++ tcpdump packet capture concept\n// tcpdump -i eth0 'tcp port 80 or tcp port 443'",
                "def wireshark_filter_commands():\n    return 'tcp.analysis.retransmission or tcp.analysis.lost_segment'"
        );
        Quiz pQ2 = helper.createModuleQuiz(pMod2, netPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 2 Assessment: Wireshark & Network Debugging", "cn-p-mod2-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(pQ2, "Wireshark & Network Debugging");

        CourseModule pMod3 = helper.createModule(netCourse, netPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 3: Low-Level Socket Programming & Network IO", "cn-p-mod3-socket-programming",
                "POSIX BSD Sockets API (socket, bind, listen, accept, send, recv), Non-blocking Sockets, and I/O Multiplexing.", 3);
        helper.createLesson(pMod3, "3.1 Low-Level Socket Programming in Java, C++ & Python", "cn-posix-socket-programming", 25, 1,
                "# Low-Level Network Socket Programming\n\nServer lifecycle:\n1. `socket()`: Create endpoint socket descriptor.\n2. `bind()`: Associate socket with local IP and port number.\n3. `listen()`: Mark socket as passive listening queue with `backlog`.\n4. `accept()`: Extract first pending connection request and return a dedicated connected socket descriptor.\n5. `recv()` / `send()`: Read and write byte stream.",
                "# POSIX Socket Programming\n\nsocket(), bind(), listen(), accept() ka low-level network programming workflow.",
                "import java.net.ServerSocket;\nimport java.net.Socket;\n\npublic class EchoServer {\n    public static void start(int port) throws Exception {\n        try (ServerSocket server = new ServerSocket(port)) {\n            Socket client = server.accept();\n            // echo data\n        }\n    }\n}",
                "#include <sys/socket.h>\n#include <netinet/in.h>\n#include <unistd.h>\n\nint runServer(int port) {\n    int server_fd = socket(AF_INET, SOCK_STREAM, 0);\n    sockaddr_in address{};\n    address.sin_family = AF_INET;\n    address.sin_port = htons(port);\n    bind(server_fd, (struct sockaddr*)&address, sizeof(address));\n    listen(server_fd, 10);\n    int new_socket = accept(server_fd, nullptr, nullptr);\n    return new_socket;\n}",
                "import socket\n\ndef run_echo_server(port):\n    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:\n        s.bind(('0.0.0.0', port))\n        s.listen(5)\n        conn, addr = s.accept()\n        data = conn.recv(1024)\n        conn.sendall(data)"
        );
        Quiz pQ3 = helper.createModuleQuiz(pMod3, netPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 3 Assessment: Socket Programming & Network IO", "cn-p-mod3-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(pQ3, "Socket Programming & Network IO");

        CourseModule pMod4 = helper.createModule(netCourse, netPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 4: Scalable Network System Design & Load Balancing", "cn-p-mod4-system-design-networks",
                "L4 vs L7 Load Balancers (HAProxy, Envoy, Nginx), Consistent Hashing, GeoDNS, and DDoS Mitigation (Cloudflare).", 4);
        helper.createLesson(pMod4, "4.1 L4 vs L7 Load Balancing & Rate Limiting", "cn-l4-vs-l7-load-balancing", 30, 1,
                "# L4 vs L7 Load Balancing Architecture\n\n* **L4 Load Balancing (Transport Layer)**: Routes traffic based on IP and TCP/UDP ports without inspecting packet payload; high throughput, minimal CPU overhead (e.g., Linux Virtual Server / IPVS, AWS NLB).\n* **L7 Load Balancing (Application Layer)**: Inspects HTTP headers, cookies, and URLs to make intelligent routing decisions (e.g., Nginx, Envoy, AWS ALB).",
                "# L4 vs L7 Load Balancing\n\nTransport layer (L4) vs Application layer (L7) load balancing trade-offs aur system design placement rounds.",
                "public class LoadBalancingAlgo {\n    // Round Robin, Least Connections, IP Hash, Weighted Response Time\n}",
                "// C++ Consistent Hashing Ring concept\n#include <map>\n#include <string>\nstd::map<uint32_t, std::string> hashRing;",
                "def pick_server_round_robin(servers, counter):\n    return servers[counter % len(servers)]"
        );
        Quiz pQ4 = helper.createModuleQuiz(pMod4, netPlacement, CurriculumLevel.PLACEMENT_READY,
                "Module 4 Assessment: Network System Design & Load Balancing", "cn-p-mod4-quiz", "10 Questions, 80% to pass.", 80);
        seedTenQuestions(pQ4, "Network System Design & Load Balancing");
    }

    private void seedTenQuestions(Quiz quiz, String topic) {
        for (int i = 1; i <= 10; i++) {
            String promptEn = String.format("In %s (Question %d): What is the core networking protocol rule or architectural principle?", topic, i);
            String promptHinglish = String.format("%s me Question %d: Networking protocol ka core rule ya architectural principle kya hai?", topic, i);
            String optionsJson = helper.buildOptionsJson(
                    "Packets bypass the transport layer and write directly to physical copper cables", "Packets transport layer bypass karte hain",
                    "Layered abstraction, flow control, and end-to-end verification guarantee reliable data delivery across networks", "Layered abstraction aur flow control reliable delivery guarantee karte hain",
                    "TCP allows unacknowledged data to grow infinitely without window bounds", "TCP bina acknowledgment ke infinite data bhejta hai",
                    "DNS queries never use caching and query root servers on every keystroke", "DNS kabhi cache nahi hota"
            );
            String explanation = String.format("For %s Question %d, strict protocol encapsulation, sliding window flow control, and congestion avoidance ensure network reliability.", topic, i);
            helper.createQuestion(quiz, promptEn, promptHinglish, null, optionsJson, "opt_b", explanation, explanation, i);
        }
    }

    private void seedTwentyFiveQuestions(Quiz quiz, String topic) {
        for (int i = 1; i <= 25; i++) {
            String promptEn = String.format("Comprehensive Networks Evaluation (%s - Q%d): Which statement accurately characterizes this networking mechanism?", topic, i);
            String promptHinglish = String.format("Grand Networks Assessment (%s - Q%d): Is networking mechanism ke baare me konsa statement bilkul sahi hai?", topic, i);
            String optionsJson = helper.buildOptionsJson(
                    "It causes unrecoverable network broadcast storms", "Ye broadcast storm create karta hai",
                    "It ensures protocol correctness, prevents congestion collapse, and optimizes end-to-end throughput", "Ye protocol correctness ensure karta hai aur throughput optimize karta hai",
                    "It violates OSI layering by ignoring IP addresses completely", "Ye IP address ignore karta hai",
                    "It is deprecated in modern Internet RFC specifications", "Ye modern RFCs me deprecated hai"
            );
            String explanation = String.format("For %s Question %d, protocol layering, mathematical flow bounds, and congestion control maintain internet scalability.", topic, i);
            helper.createQuestion(quiz, promptEn, promptHinglish, null, optionsJson, "opt_b", explanation, explanation, i);
        }
    }
}
