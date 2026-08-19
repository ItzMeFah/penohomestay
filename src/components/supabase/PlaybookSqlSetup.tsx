import React from 'react';
import { SqlQueryEditor } from './SqlQueryEditor';

interface PlaybookSqlSetupProps {
  sqlSnippets?: {
    fullSetup: string;
    storageSetup: string;
  };
  copiedText?: string | null;
  handleCopy?: (text: string, id: string) => void;
}

export const PlaybookSqlSetup: React.FC<PlaybookSqlSetupProps> = () => {
  return (
    <div className="space-y-6">
      <SqlQueryEditor />
    </div>
  );
};
