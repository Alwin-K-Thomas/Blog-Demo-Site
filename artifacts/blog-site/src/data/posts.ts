export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt: string | null;
  author: string;
  tags: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export const STATIC_POSTS: Post[] = [
  {
    id: 1,
    title: "Getting Started with Kubernetes: Core Concepts Explained",
    excerpt:
      "A practical walkthrough of the core Kubernetes primitives: Pods, Deployments, Services, ConfigMaps, and Namespaces.",
    content: `Kubernetes has become the standard platform for deploying and managing containerized workloads at scale. Understanding its core primitives is essential for anyone working in modern infrastructure.

At the heart of Kubernetes is the Pod — the smallest deployable unit, wrapping one or more containers that share a network and storage context. Pods are ephemeral by design; they come and go. Higher-level controllers like Deployments and StatefulSets manage them, ensuring the desired number of replicas are always running and handling rolling updates without downtime.

Services provide stable networking on top of the ephemeral Pod layer. A ClusterIP Service gives you a consistent internal IP and DNS name that load-balances across matching Pods, even as they are rescheduled across nodes. For external traffic, NodePort and LoadBalancer Services, or an Ingress controller, route requests into the cluster.

ConfigMaps and Secrets decouple configuration from container images — a critical pattern for running the same image across dev, staging, and production environments. Namespaces provide logical isolation and are the boundary for most RBAC policies.

Mastering these objects gives you a solid foundation. Everything else in the ecosystem — Helm charts, Operators, service meshes — builds on top of them.`,
    author: "Alex Johnson",
    tags: "kubernetes, fundamentals, containers",
    published: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    title: "Kubernetes Networking Deep Dive: Services, Ingress, and DNS",
    excerpt:
      "How Kubernetes handles Pod networking, Service discovery, DNS resolution, and Ingress — from first principles.",
    content: `Networking in Kubernetes is one of the most misunderstood parts of the platform. Once the model clicks, a lot of operational mysteries become clear.

Every Pod gets its own IP address within the cluster network. The Container Network Interface (CNI) plugin — Flannel, Calico, Cilium, and others — is responsible for allocating and routing these addresses. Pods can communicate directly with each other by IP, across nodes, without NAT.

Services sit on top of Pods and provide stable discovery. kube-proxy (or eBPF-based alternatives like Cilium) programs iptables or BPF rules on every node, intercepting traffic to the Service ClusterIP and NAT-ing it to a healthy Pod endpoint. DNS-based discovery via CoreDNS means your app connects to my-service.my-namespace.svc.cluster.local and gets the ClusterIP back.

Ingress resources give you HTTP/HTTPS routing at the edge — host-based and path-based rules that map to backend Services. The Ingress controller (NGINX, Traefik, or a cloud-native option) watches Ingress objects and configures itself accordingly.

For advanced needs, a service mesh like Istio or Linkerd inserts a sidecar proxy into each Pod, giving you mTLS, traffic shaping, retries, and distributed tracing without changing application code.`,
    author: "Maria Chen",
    tags: "kubernetes, networking, ingress",
    published: true,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    title: "Writing Production-Ready Kubernetes Manifests",
    excerpt:
      "Resource requests, liveness probes, Pod Disruption Budgets, and graceful shutdown: the four patterns every production workload needs.",
    content: `Getting an app running in Kubernetes is straightforward. Getting it running reliably under production load takes more care. Here are the patterns that separate a weekend project from a production workload.

Always set resource requests and limits. Requests are used by the scheduler to find a node with enough headroom; limits cap what the container can consume. Without requests, the scheduler is flying blind. Without limits, a noisy container can starve its neighbors.

Configure liveness and readiness probes. The readiness probe controls whether a Pod receives traffic — only mark a Pod ready when it can actually serve requests. The liveness probe lets Kubernetes restart a stuck process. Never set them to the same endpoint with the same thresholds.

Use Pod Disruption Budgets to protect availability during voluntary disruptions: node drains, cluster upgrades, and Helm rollbacks. A PDB that guarantees at least 2 replicas are always available prevents your Deployment from accidentally going to zero.

Set appropriate termination grace periods and handle SIGTERM in your application. Kubernetes sends SIGTERM before SIGKILL. Applications that trap the signal and drain in-flight requests achieve zero-downtime rolling updates. Those that ignore it drop connections.

Combining these four patterns — resources, probes, PDBs, and graceful shutdown — covers the majority of production incident classes.`,
    author: "Sam Rivera",
    tags: "kubernetes, production, reliability",
    published: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    title: "Helm Charts: Packaging and Distributing Kubernetes Applications",
    excerpt:
      "How Helm turns a pile of YAML into a versioned, configurable, one-command install.",
    content: `Helm is the package manager for Kubernetes, and once you understand its model it becomes indispensable for managing application lifecycle.

A Helm chart is a directory of templates — Kubernetes manifests with Go template expressions — plus a values.yaml file that supplies default configuration. When you run helm install, Helm renders the templates with your values and applies the resulting YAML to the cluster. Upgrading is helm upgrade; rolling back is helm rollback. Every release is tracked with a revision number.

The values file is the key abstraction. Operators override defaults at install time with --set or -f values.yaml flags, letting the same chart deploy to development, staging, and production with different replica counts, resource limits, and image tags. Well-authored charts expose everything an operator might reasonably want to tune, with sensible defaults for the rest.

Chart repositories (ChartMuseum, OCI registries, GitHub Pages) distribute charts the way npm distributes packages. Helm Hub and Artifact Hub index thousands of open-source charts for databases, monitoring stacks, ingress controllers, and more.

For complex applications — multi-chart deployments with explicit dependency ordering — Helmfile or ArgoCD's App of Apps pattern composes multiple charts into a single declarative configuration.`,
    author: "Alex Johnson",
    tags: "kubernetes, helm, devops",
    published: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    title: "GitOps with ArgoCD: Continuous Delivery for Kubernetes",
    excerpt:
      "GitOps treats your Git repository as the single source of truth. ArgoCD makes that practical for any Kubernetes cluster.",
    content: `GitOps is an operational model where Git is the source of truth for cluster state. Every change to your infrastructure goes through a pull request. The cluster continuously reconciles toward what Git says it should look like. Drift is detected and corrected automatically.

ArgoCD implements this model as a Kubernetes-native controller. You point it at a Git repository and a target namespace; it watches the repo for changes, diffs the desired state against the live state, and syncs. Applications are defined as ArgoCD Application custom resources, which themselves live in Git — the App of Apps pattern.

The developer workflow becomes: open a PR to change a manifest or values file, get it reviewed and merged, watch ArgoCD sync the change to the cluster within seconds. No manual kubectl apply. No "it works on my machine but not in prod" because the same YAML that passed review is what runs in production.

ArgoCD's UI provides a real-time DAG of every Kubernetes resource in an Application — Deployments, ReplicaSets, Pods, Services, ConfigMaps — with live health status. It surfaces sync errors and diff views directly, making it far easier to diagnose why a deployment is out of sync.

Progressive delivery extensions like Argo Rollouts integrate with ArgoCD to add canary and blue-green strategies on top of the standard GitOps flow.`,
    author: "Maria Chen",
    tags: "kubernetes, gitops, argocd",
    published: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
