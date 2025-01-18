import { ConfigModal } from "@/components/ConfigModal";
import { StyleGenerator } from "@/components/StyleGenerator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Musical Style Generator</h1>
          <ConfigModal />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <StyleGenerator />
      </main>
    </div>
  );
};

export default Index;