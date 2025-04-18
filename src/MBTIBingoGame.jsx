import React from 'react';
import { useState } from 'react';

const mbtiGroups = [
  ["ISTP", "ISFP", "ESTP", "ESFP"],
  ["INFJ", "INFP", "ENFJ", "ENFP"],
  ["ISTJ", "ISFJ", "ESTJ", "ESFJ"],
  ["INTJ", "INTP", "ENTJ", "ENTP"]
];

const groupColors = [
  'yellow', // STP/SFP
  'green',  // NFJ/NFP
  'blue',   // STJ/SFJ
  'purple'  // NTJ/NTP
];

import traitsData from './mbti-traitsData-full.js';

export default function MBTIBingoGame() {
  const [selectedTraits, setSelectedTraits] = useState([]);
  const [page, setPage] = useState(0);
  const [result, setResult] = useState(null);

  const currentTypes = mbtiGroups[page];
  const currentColor = groupColors[page];
  const allCurrentTraits = currentTypes.flatMap((type) => traitsData[type] || []);

  const toggleTrait = (trait) => {
    setSelectedTraits((prev) =>
      prev.includes(trait) ? prev.filter((t) => t !== trait) : [...prev, trait]
    );
  };

  const calculateResult = () => {
    const scores = {};
    for (const group of mbtiGroups) {
      for (const type of group) {
        const traits = traitsData[type] || [];
        const matched = traits.filter((t) => selectedTraits.includes(t)).length;
        scores[type] = Math.round((matched / traits.length) * 100);
      }
    }
    setResult(scores);
  };

  return (
    <div className={`p-4 max-w-6xl mx-auto space-y-4 text-${currentColor}-900 bg-cover bg-center min-h-screen`} style={{ backgroundImage: "url('/bg.jpg')" }}>
      <h1 className={`text-3xl font-bold text-center text-${currentColor}-600`}>MBTI Bingo 游戏 · 第 {page + 1} 页</h1>
      <div className="grid grid-cols-4 gap-4 p-4 bg-white bg-opacity-80 rounded-xl">
        {currentTypes.map((type) => (
          <div key={type} className="space-y-2">
            <h2 className="text-center font-bold text-base text-gray-700 border-b border-gray-400 pb-1">{type}</h2>
            <div className="grid grid-cols-1 gap-1">
              {(traitsData[type] || []).map((trait, index) => (
                <div
                  key={index}
                  className={`p-2 border rounded text-sm text-center cursor-pointer transition duration-300 ${
                    selectedTraits.includes(trait)
                      ? `bg-${currentColor}-400 ${currentColor === 'yellow' ? 'text-black' : 'text-white'} font-semibold scale-105`
                      : `bg-gray-100 hover:bg-${currentColor}-100`
                  }`}
                  onClick={() => toggleTrait(trait)}
                >
                  {trait}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <button
          disabled={page === 0}
          onClick={() => setPage((prev) => Math.max(0, prev - 1))}
          className="bg-gray-300 hover:bg-gray-400 text-sm px-3 py-1 rounded disabled:opacity-50"
        >
          上一页
        </button>
        {page < mbtiGroups.length - 1 ? (
          <button
            onClick={() => setPage((prev) => Math.min(mbtiGroups.length - 1, prev + 1))}
            className="bg-gray-300 hover:bg-gray-400 text-sm px-3 py-1 rounded disabled:opacity-50"
          >
            下一页
          </button>
        ) : (
          <button
            onClick={calculateResult}
            className="bg-gray-300 hover:bg-gray-400 text-sm px-3 py-1 rounded disabled:opacity-50"
          >
            查看你的 MBTI 匹配度
          </button>
        )}
      </div>
      {result && (
        <div className="mt-4 p-4 bg-white bg-opacity-80 rounded-lg">
          <h2 className="font-semibold mb-2">匹配结果：</h2>
          <ul className="space-y-1">
            {Object.entries(result).map(([type, score]) => (
              <li key={type}>{type}：{score}%</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
