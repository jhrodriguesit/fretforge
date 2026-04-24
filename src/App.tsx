import { useState } from 'react';
import type { Note } from './data/notes';
import type { ScaleMode } from './types/music';
import type { ScaleTab } from './data/scales';
import Header from './components/Header/Header';
import RootSelector from './components/RootSelector/RootSelector';
import ScaleModeToggle from './components/ScaleModeToggle/ScaleModeToggle';
import HarmonicField from './components/HarmonicField/HarmonicField';
import ScaleExplorer from './components/ScaleExplorer/ScaleExplorer';
import TheoryNotes from './components/TheoryNotes/TheoryNotes';

const App = () => {
  const [selectedRoot, setSelectedRoot] = useState<Note>('C');
  const [scaleMode, setScaleMode] = useState<ScaleMode>('major');
  const [scaleTab, setScaleTab] = useState<ScaleTab>('major');
  const scaleType = scaleTab === 'blues' ? 'minorBlues' : scaleTab;

  return (
    <>
      <Header />
      <main className="max-w-[1000px] mx-auto px-8 py-12 space-y-16">
        <section className="space-y-6">
          <h2 className="text-sm font-bold tracking-widest text-text-secondary uppercase">
            Select Root
          </h2>
          <RootSelector
            selectedRoot={selectedRoot}
            mode={scaleMode}
            onRootChange={setSelectedRoot}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold tracking-widest text-text-secondary uppercase">
            Scale Mode
          </h2>
          <ScaleModeToggle mode={scaleMode} onModeChange={setScaleMode} />
        </section>

        <HarmonicField selectedRoot={selectedRoot} scaleMode={scaleMode} />

        <ScaleExplorer
          selectedRoot={selectedRoot}
          tab={scaleTab}
          onTabChange={setScaleTab}
        />

        <TheoryNotes
          selectedRoot={selectedRoot}
          scaleMode={scaleMode}
          scaleType={scaleType}
        />
      </main>
    </>
  );
};

export default App;
