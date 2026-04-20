import { useState } from 'react';
import type { Note } from './data/notes';
import type { ScaleMode } from './types/music';
import Header from './components/Header/Header';
import RootSelector from './components/RootSelector/RootSelector';
import ScaleModeToggle from './components/ScaleModeToggle/ScaleModeToggle';
import HarmonicField from './components/HarmonicField/HarmonicField';

const App = () => {
  const [selectedRoot, setSelectedRoot] = useState<Note>('C');
  const [scaleMode, setScaleMode] = useState<ScaleMode>('major');

  return (
    <>
      <Header />
      <main className="max-w-[1000px] mx-auto px-8 py-12 space-y-16">
        <section className="space-y-6">
          <h2 className="text-sm font-bold tracking-widest text-text-secondary uppercase">
            Select Root
          </h2>
          <RootSelector selectedRoot={selectedRoot} onRootChange={setSelectedRoot} />
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold tracking-widest text-text-secondary uppercase">
            Scale Mode
          </h2>
          <ScaleModeToggle mode={scaleMode} onModeChange={setScaleMode} />
        </section>

        <HarmonicField selectedRoot={selectedRoot} scaleMode={scaleMode} />
      </main>
    </>
  );
};

export default App;
