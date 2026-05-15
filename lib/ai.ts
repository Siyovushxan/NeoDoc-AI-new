import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export interface AIGenerateOptions {
  type: 'presentation' | 'referat' | 'kurs_ishi' | 'mustaqil_talim' | 'infografika';
  topic: string;
  language: 'uz' | 'ru' | 'en';
  additionalNotes?: string;
}

// Prompts for different document types
const prompts: Record<AIGenerateOptions['type'], (opt: AIGenerateOptions) => string> = {
  referat: (opt) => `
You are a professional academic essay writer in ${opt.language} language. Generate a complete academic essay (referat) with exactly this JSON structure. Return ONLY valid JSON, no markdown or explanation:

{
  "title": "string (essay title based on topic: ${opt.topic})",
  "coverInfo": {
    "university": "string",
    "faculty": "string",
    "department": "string"
  },
  "introduction": "string (minimum 500 words, set context and objectives)",
  "chapters": [
    {
      "heading": "string (first main topic)",
      "content": "string (minimum 700 words, detailed analysis)",
      "subsections": [
        {
          "heading": "string",
          "content": "string (400+ words)"
        }
      ]
    },
    {
      "heading": "string (second main topic)",
      "content": "string (minimum 700 words, detailed analysis)",
      "subsections": [
        {
          "heading": "string",
          "content": "string (400+ words)"
        }
      ]
    }
  ],
  "conclusion": "string (minimum 300 words, summary and findings)",
  "references": ["string (minimum 5-8 references in APA format)"]
}

Topic: ${opt.topic}
${opt.additionalNotes ? `Additional requirements: ${opt.additionalNotes}` : ''}
`,

  kurs_ishi: (opt) => `
You are a professional term paper writer in ${opt.language} language. Generate a complete term paper with exactly this JSON structure. Return ONLY valid JSON:

{
  "title": "string",
  "coverInfo": {
    "university": "string",
    "faculty": "string",
    "department": "string",
    "author": "string"
  },
  "introduction": "string (800+ words with objectives, tasks, hypothesis, methods)",
  "chapters": [
    {
      "heading": "string (Chapter 1: Theoretical Foundation)",
      "content": "string (1500+ words, detailed theory)"
    },
    {
      "heading": "string (Chapter 2: Analysis and Research)",
      "content": "string (1500+ words, in-depth analysis)"
    },
    {
      "heading": "string (Chapter 3: Practical Aspects)",
      "content": "string (1500+ words, practical implementation)"
    }
  ],
  "conclusion": "string (500+ words, conclusions and recommendations)",
  "references": ["string (10-15 references in APA format)"]
}

Topic: ${opt.topic}
${opt.additionalNotes ? `Additional requirements: ${opt.additionalNotes}` : ''}
`,

  mustaqil_talim: (opt) => `
You are a professional independent study writer in ${opt.language} language. Generate a complete independent work with exactly this JSON structure. Return ONLY valid JSON:

{
  "title": "string",
  "coverInfo": {
    "university": "string",
    "course": "string",
    "author": "string"
  },
  "introduction": "string (400+ words, context and importance)",
  "chapters": [
    {
      "heading": "string (Chapter 1: Key Concepts)",
      "content": "string (800+ words, theoretical foundation)"
    },
    {
      "heading": "string (Chapter 2: Application and Analysis)",
      "content": "string (800+ words, practical analysis)"
    }
  ],
  "testQuestions": ["string (5-8 test questions with answers)"],
  "conclusion": "string (300+ words, summary)",
  "references": ["string (7-10 references in APA format)"]
}

Topic: ${opt.topic}
${opt.additionalNotes ? `Additional requirements: ${opt.additionalNotes}` : ''}
`,

  presentation: (opt) => `
You are a professional presentation designer in ${opt.language} language. Generate presentation content with exactly this JSON structure. Return ONLY valid JSON:

{
  "title": "string",
  "subtitle": "string",
  "colorTheme": "blue",
  "slides": [
    {
      "slideNumber": 1,
      "type": "title",
      "heading": "string (main title)",
      "bullets": [],
      "speakerNotes": "string"
    },
    {
      "slideNumber": 2,
      "type": "content",
      "heading": "string (agenda/table of contents)",
      "bullets": ["string (3-4 key topics)"],
      "speakerNotes": "string"
    },
    {
      "slideNumber": 3,
      "type": "content",
      "heading": "string (first main topic)",
      "bullets": ["string (3-4 bullet points with details)"],
      "speakerNotes": "string"
    },
    {
      "slideNumber": 4,
      "type": "content",
      "heading": "string (second main topic)",
      "bullets": ["string (3-4 bullet points with details)"],
      "speakerNotes": "string"
    },
    {
      "slideNumber": 5,
      "type": "conclusion",
      "heading": "string (key takeaways)",
      "bullets": ["string (3-4 main points to remember)"],
      "speakerNotes": "string"
    }
  ]
}

Topic: ${opt.topic}
${opt.additionalNotes ? `Additional requirements: ${opt.additionalNotes}` : ''}
`,

  infografika: (opt) => `
You are a professional infographic designer in ${opt.language} language. Generate infographic data with exactly this JSON structure. Return ONLY valid JSON:

{
  "title": "string (main title for infographic)",
  "subtitle": "string (subtitle)",
  "colorTheme": "tech",
  "stats": [
    { "value": "string (number or percentage)", "label": "string (description)" },
    { "value": "string", "label": "string" },
    { "value": "string", "label": "string" },
    { "value": "string", "label": "string" }
  ],
  "facts": [
    "string (fact 1 with icon/number)",
    "string (fact 2 with icon/number)",
    "string (fact 3 with icon/number)",
    "string (fact 4 with icon/number)",
    "string (fact 5 with icon/number)",
    "string (fact 6 with icon/number)"
  ],
  "process": [
    "string (step 1)",
    "string (step 2)",
    "string (step 3)",
    "string (step 4)"
  ],
  "conclusion": "string (main takeaway or call to action)"
}

Topic: ${opt.topic}
${opt.additionalNotes ? `Additional requirements: ${opt.additionalNotes}` : ''}
`,
};

export async function generateAIContent(options: AIGenerateOptions): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = prompts[options.type](options);

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsedData = JSON.parse(jsonMatch[0]);
    return parsedData;
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw new Error('Failed to generate content. Please try again.');
  }
}

// Fallback document generator
export function generateFallbackDocument(options: AIGenerateOptions): any {
  const lang = options.language;
  const fallbackTitles: Record<string, Record<string, string>> = {
    uz: {
      referat: 'Mavzuni batafsil tahlil',
      kurs_ishi: 'Kurs ishi - Tadqiqot va analiz',
      mustaqil_talim: 'Mustaqil ta\'lim ishi',
      presentation: 'Presentation - Asosiy ma\'lumotlar',
      infografika: 'Infografika - Statistika va faktlar',
    },
    ru: {
      referat: 'Анализ темы',
      kurs_ishi: 'Курсовая работа - Исследование',
      mustaqil_talim: 'Самостоятельная работа',
      presentation: 'Презентация - Основная информация',
      infografika: 'Инфографика - Статистика',
    },
    en: {
      referat: 'Topic Analysis',
      kurs_ishi: 'Term Paper - Research',
      mustaqil_talim: 'Independent Study',
      presentation: 'Presentation - Key Information',
      infografika: 'Infographic - Statistics',
    },
  };

  return {
    title: fallbackTitles[lang]?.[options.type] || 'Document',
    content: `Generated document about: ${options.topic}`,
    language: lang,
  };
}
