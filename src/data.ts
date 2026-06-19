import { BotScenario, Rule } from './types';

export const SUPPORT_SCENARIO: BotScenario = {
  id: 'support',
  name: 'Support Assistant',
  tagline: 'Standard e-commerce & helpdesk agent',
  description: 'Matches common customer service FAQs (pricing, hours, refunds) using keyword overrides.',
  icon: 'Headphones',
  welcomeMessage: 'Welcome to helpdesk support! How can I assist you today? You can ask about our "pricing", "store hours", "returns", or request a "human supervisor".',
  defaultRules: [
    {
      id: 'sup-greet',
      name: 'Greeting welcome',
      triggerType: 'contains',
      patterns: ['hello', 'hi', 'hey', 'greetings', 'yo'],
      response: 'Hello there! Thanks for reaching out. What can I help you resolve today? (Available topics: pricing, hours, return policy, password reset)',
      category: 'General',
      usageCount: 0,
      isSystem: true
    },
    {
      id: 'sup-price',
      name: 'Pricing Plans',
      triggerType: 'contains',
      patterns: ['price', 'pricing', 'cost', 'how much', 'plan', 'subscription'],
      response: 'Our platform is free for single users! Our Pro Plan costs $12/month and supports team collaboration, unlimited exports, and custom templates.',
      category: 'Billing',
      usageCount: 0,
      isSystem: true
    },
    {
      id: 'sup-hours',
      name: 'Business Hours',
      triggerType: 'contains',
      patterns: ['hours', 'open', 'close', 'time', 'schedule', 'weekend'],
      response: 'Our software is available 24/7. Live customer support agents are online Monday through Friday, 8:00 AM to 6:00 PM EST.',
      category: 'General',
      usageCount: 0,
      isSystem: true
    },
    {
      id: 'sup-return',
      name: 'Return & Refund Policy',
      triggerType: 'contains',
      patterns: ['return', 'refund', 'money back', 'cancel', 'policy'],
      response: 'We offer a full 14-day money-back guarantee. If you are not satisfied, you can request a refund directly from your account billing panel.',
      category: 'Billing',
      usageCount: 0,
      isSystem: true
    },
    {
      id: 'sup-reset',
      name: 'Password Reset help',
      triggerType: 'contains',
      patterns: ['password', 'reset', 'login', 'forgot', 'access'],
      response: 'To reset your login credentials, click "Forgot Password" on the login portal. If you are locked out, you can verify your account via OTP.',
      category: 'Security',
      usageCount: 0,
      isSystem: true
    },
    {
      id: 'sup-human',
      name: 'Escalate to Representative',
      triggerType: 'contains',
      patterns: ['human', 'agent', 'person', 'representative', 'supervisor', 'speak to some'],
      response: 'I am routing your request to our ticket queue. A human colleague will email you within 2 business hours. You can also contact care@example.com.',
      category: 'Escalation',
      usageCount: 0,
      isSystem: true
    },
    {
      id: 'sup-contact',
      name: 'Contact Numbers',
      triggerType: 'contains',
      patterns: ['contact', 'phone', 'call', 'email', 'address', 'office'],
      response: 'Reach us via email at support@example.com, or phone at +1 (800) 555-0155 during standard office hours.',
      category: 'General',
      usageCount: 0,
      isSystem: true
    },
    {
      id: 'sup-thank',
      name: 'User Thanking',
      triggerType: 'contains',
      patterns: ['thank', 'thanks', 'awesome', 'helpful', 'cool'],
      response: "You're very welcome! I am glad I could help. Let me know if there is anything else you need.",
      category: 'General',
      usageCount: 0,
      isSystem: true
    }
  ]
};

export const ADVENTURE_SCENARIO: BotScenario = {
  id: 'adventure',
  name: 'Adventure Quest',
  tagline: 'Text-based interactive Zork generator',
  description: 'Navigate a mythical house using clean strict commands. Demonstrates action state matching.',
  icon: 'Compass',
  welcomeMessage: 'You open your eyes. You are standing in an open field west of a white boarded house. A cold wind blows from the North. What will you do? Try "look", "east", "open door", "go north".',
  defaultRules: [
    {
      id: 'adv-look',
      name: 'Describe scene',
      triggerType: 'contains',
      patterns: ['look', 'inspect', 'scenery', 'where am i', 'restart', 'help'],
      response: 'You see a mysterious white house with boarded windows. There is a dense dark forest to the "north", a steep cliff to the "south", and a locked front door to the "east".',
      category: 'Adventure',
      usageCount: 0,
      isSystem: true
    },
    {
      id: 'adv-north',
      name: 'Go North (Forest)',
      triggerType: 'exact',
      patterns: ['north', 'go north', 'forest', 'enter forest'],
      response: 'You journey north into the damp forest. The canopy blocker prevents light. Brambles snag your sleeves. Deep in the woods, you spot a "shining chest" covered in ivy.',
      category: 'Adventure',
      usageCount: 0,
      isSystem: true
    },
    {
      id: 'adv-south',
      name: 'Go South (Cliff)',
      triggerType: 'exact',
      patterns: ['south', 'go south', 'cliff', 'jump'],
      response: 'You approach the edge of a sheer cliff. Ocean waves crash hundreds of feet below. It is far too dangerous to jump or climb down. You must turn back.',
      category: 'Adventure',
      usageCount: 0,
      isSystem: true
    },
    {
      id: 'adv-east',
      name: 'Approach House East',
      triggerType: 'contains',
      patterns: ['east', 'go east', 'house', 'door', 'front door'],
      response: 'You walk toward the front door of the white house. It has a rusty brass keyhole, but it is locked shut. A locked side window nearby seems slightly ajar.',
      category: 'Adventure',
      usageCount: 0,
      isSystem: true
    },
    {
      id: 'adv-chest',
      name: 'Open Ivy Chest',
      triggerType: 'contains',
      patterns: ['chest', 'shining chest', 'open chest', 'ivy chest', 'grab chest'],
      response: 'You push aside the leafy ivy and open the chest. Rested on velvet index cards is a "silver key"! Type "take key" to pick it up.',
      category: 'Adventure',
      usageCount: 0,
      isSystem: true
    },
    {
      id: 'adv-take',
      name: 'Take Silver Key',
      triggerType: 'contains',
      patterns: ['take key', 'grab key', 'pick up key', 'get key', 'key'],
      response: 'You pick up the solid silver key. It feels heavy and cool. You can now use it at the house! Head East and type "unlock door" or "use key".',
      category: 'Adventure',
      usageCount: 0,
      isSystem: true
    },
    {
      id: 'adv-unlock',
      name: 'Unlock Door',
      triggerType: 'contains',
      patterns: ['unlock', 'use key', 'unlock door', 'open window'],
      response: 'SUCCESS! You turn the silver key in the heavy front door. It clicks open with a loud groan! Indoors you find walls covered with books, and a victory banner: "YOU SOLVED THE ADVENTURE PROMPT!" Type "look" to reset.',
      category: 'Adventure',
      usageCount: 0,
      isSystem: true
    }
  ]
};

export const ELIZA_SCENARIO: BotScenario = {
  id: 'eliza',
  name: 'ELIZA Psychotherapist',
  tagline: 'The historic 1966 Rogerian therapist',
  description: 'Uses open-ended reflection pattern matching to rephrase user inputs, making you reflect on feelings.',
  icon: 'BrainCircuit',
  welcomeMessage: 'Hello. I am Eliza, your personal computer psychotherapist. Tell me what is on your mind today.',
  defaultRules: [
    {
      id: 'eliza-sad',
      name: 'Dejected feelings',
      triggerType: 'contains',
      patterns: ['sad', 'depressed', 'unhappy', 'lonely', 'bad', 'down', 'angry', 'hurt'],
      response: "I'm sorry to hear that you are feeling this way. Do you believe coming here has triggered these emotions? What can we do to explore that?",
      category: 'Therapy',
      usageCount: 0,
      isSystem: true
    },
    {
      id: 'eliza-happy',
      name: 'Joyous feelings',
      triggerType: 'contains',
      patterns: ['happy', 'glad', 'good', 'joy', 'excited', 'great', 'fantastic'],
      response: 'It is wonderful to hear that! What specific events or thoughts are contributing to these positive feelings?',
      category: 'Therapy',
      usageCount: 0,
      isSystem: true
    },
    {
      id: 'eliza-family',
      name: 'Family references',
      triggerType: 'contains',
      patterns: ['mother', 'father', 'brother', 'sister', 'parent', 'parents', 'family', 'son', 'daughter'],
      response: 'Family relationships hold key emotional roots. Who else in your family makes you feel similarly, and how do they communicate?',
      category: 'Therapy',
      usageCount: 0,
      isSystem: true
    },
    {
      id: 'eliza-question',
      name: 'User asking questions',
      triggerType: 'contains',
      patterns: ['why', 'what', 'how', 'who', 'where', 'are you'],
      response: 'Why do you ask that question? Does finding the answer satisfy blockages or change your path?',
      category: 'Therapy',
      usageCount: 0,
      isSystem: true
    },
    {
      id: 'eliza-can',
      name: 'Ability triggers',
      triggerType: 'contains',
      patterns: ['can you', 'could you', 'will you'],
      response: 'You believe I am capable of doing that? What would it mean if you possessed that capability instead?',
      category: 'Therapy',
      usageCount: 0,
      isSystem: true
    },
    {
      id: 'eliza-hate',
      name: 'Strong dislike',
      triggerType: 'contains',
      patterns: ['hate', 'dislike', 'despise', 'annoyed'],
      response: 'Strong feelings of aversion can be heavy. What lies underneath this irritation? Does it remind you of a past hurdle?',
      category: 'Therapy',
      usageCount: 0,
      isSystem: true
    },
    {
      id: 'eliza-dream',
      name: 'Dream recall',
      triggerType: 'contains',
      patterns: ['dream', 'dreams', 'nightmare', 'asleep'],
      response: 'What do you think that dream signifies? How do your daytime events weave into your dreams?',
      category: 'Therapy',
      usageCount: 0,
      isSystem: true
    }
  ]
};

export const BOT_SCENARIOS: BotScenario[] = [
  SUPPORT_SCENARIO,
  ADVENTURE_SCENARIO,
  ELIZA_SCENARIO
];

/**
 * Normalizes input text according to NLP guidelines
 */
export function normalizeText(text: string): { normalized: string; tokens: string[] } {
  // 1. Lowercase
  let normalized = text.toLowerCase();
  
  // 2. Strip punctuation (keep standard spaces)
  normalized = normalized.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, ' ');
  
  // 3. Trim and squeeze spacing
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  // 4. Tokenize
  const tokens = normalized.split(' ').filter(Boolean);
  
  return { normalized, tokens };
}

/**
 * Processes a user message against active rules of a scenario
 */
export function processRuleEngine(
  input: string,
  rules: Rule[],
  fallbackResponses: string[] = [
    "I understand, please go on. Tell me more.",
    "Hmm, that didn't match any of my predefined rule pathways. Try using different keywords!",
    "Does saying that make you feel good?",
    "Could you rephrase that? Try checking my understood rules displayed on the right."
  ]
): { matchedRule?: Rule; debugInfo: any } {
  const startTime = performance.now();
  const evaluationSteps: any[] = [];
  
  // Phase 1: Normalization
  evaluationSteps.push({
    stepName: 'Input Acquisition',
    details: `Original utterance received: "${input}"`,
    status: 'info'
  });
  
  const { normalized, tokens } = normalizeText(input);
  
  evaluationSteps.push({
    stepName: 'Text Normalization',
    details: `Normalized string: "${normalized}" (Stripped symbols, squeezed spaces, lowercased)`,
    status: 'success'
  });
  
  evaluationSteps.push({
    stepName: 'Lexical Tokenization',
    details: `Tokens derived: [${tokens.map(t => `"${t}"`).join(', ')}] (Total count: ${tokens.length})`,
    status: 'success'
  });
  
  // Rule Matching logic prioritizes exact match, then starts_with, then regex, then contains
  // It checks rules in order. Let's group rules by trigger types or iterate through them.
  let matchedRule: Rule | undefined = undefined;
  let matchedPatternUsed = '';
  let matchScore = 0;
  
  evaluationSteps.push({
    stepName: 'Rule Scanning',
    details: `Iterating through ${rules.length} active rules to locate matcher constraints.`,
    status: 'info'
  });

  // Helper matching function
  for (const rule of rules) {
    const trigger = rule.triggerType;
    let isMatch = false;
    let score = 0;
    
    for (const pattern of rule.patterns) {
      const normPattern = pattern.toLowerCase().trim();
      
      if (trigger === 'exact') {
        if (normalized === normPattern) {
          isMatch = true;
          score = 1.0;
          matchedPatternUsed = pattern;
          break;
        }
      } else if (trigger === 'starts_with') {
        if (normalized.startsWith(normPattern)) {
          isMatch = true;
          // Score based on pattern length compared to total length
          score = Number((normPattern.length / Math.max(1, normalized.length)).toFixed(2));
          matchedPatternUsed = pattern;
          break;
        }
      } else if (trigger === 'regex') {
        try {
          const reg = new RegExp(normPattern, 'i');
          if (reg.test(normalized)) {
            isMatch = true;
            score = 0.9;
            matchedPatternUsed = pattern;
            break;
          }
        } catch (e) {
          // Bad regex syntax
          evaluationSteps.push({
            stepName: 'Regex Failure',
            details: `Rule "${rule.name}" contains invalid regex pattern "${pattern}"`,
            status: 'fail'
          });
        }
      } else { // trigger === 'contains'
        // Contains as substring or word check
        if (normalized.includes(normPattern)) {
          isMatch = true;
          // Let's do a word overlap score
          const patternWords = normPattern.split(' ').filter(Boolean);
          const unionWords = tokens.filter(tok => patternWords.includes(tok));
          score = Number((unionWords.length / Math.max(1, patternWords.length)).toFixed(2));
          if (score === 0) score = 0.5; // fallback weight for partial match
          matchedPatternUsed = pattern;
          break;
        }
      }
    }
    
    if (isMatch) {
      matchedRule = rule;
      matchScore = score;
      break; // Found our primary custom or default rule trigger
    }
  }
  
  if (matchedRule) {
    evaluationSteps.push({
      stepName: 'Match Decision',
      details: `SUCCESS: Matches Rule ID "${matchedRule.id}" ("${matchedRule.name}") with score ${matchScore} via pattern "${matchedPatternUsed}" [Type: ${matchedRule.triggerType}]`,
      status: 'success'
    });
  } else {
    evaluationSteps.push({
      stepName: 'Match Decision',
      details: 'FAIL: No rules satisfied of the user patterns. Activating fallback responses.',
      status: 'fail'
    });
  }
  
  const searchTimeMs = Number((performance.now() - startTime).toFixed(3));
  
  return {
    matchedRule,
    debugInfo: {
      originalText: input,
      normalizedText: normalized,
      tokens,
      matchedPattern: matchedPatternUsed || undefined,
      triggerType: matchedRule?.triggerType,
      matchScore: matchedRule ? matchScore : 0,
      evaluationSteps,
      searchTimeMs
    }
  };
}
