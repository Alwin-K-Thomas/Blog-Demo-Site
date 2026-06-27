import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PostsProvider } from "@/store/posts-context";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Posts from "@/pages/posts";
import PostDetail from "@/pages/post-detail";
import Admin from "@/pages/admin";
import AdminPostForm from "@/pages/admin-post-form";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/posts" component={Posts} />
      <Route path="/posts/:id" component={PostDetail} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/new" component={AdminPostForm} />
      <Route path="/admin/edit/:id" component={AdminPostForm} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <PostsProvider>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </PostsProvider>
  );
}

export default App;
