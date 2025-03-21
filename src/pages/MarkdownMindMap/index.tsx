/*
 * @Author: Diana Tang
 * @Date: 2025-03-21 16:06:14
 * @LastEditors: Diana Tang
 * @Description: some description
 * @FilePath: /AI-Health-News-Agent-Ant/src/pages/MarkdownMindMap/index.tsx
 */
import React from "react";
import MarkdownMind from "./MarkdownMind";
import {initialTxt }from './initialData'

const MarkdownMindMap: React.FC = () => {

    return (
    <div>

      <MarkdownMind
        initialMarkdown={initialTxt}
        width={900} // Customize width
        height={700} // Customize height
      />
    </div>
  );
};

export default MarkdownMindMap;
