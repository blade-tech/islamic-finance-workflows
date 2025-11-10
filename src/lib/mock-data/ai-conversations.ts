/**
 * PRE-SCRIPTED AI CONVERSATIONS
 * ==============================
 * Mock AI assistant conversations demonstrating 4 key capabilities:
 * 1. Calculate capital impairment (happy path)
 * 2. Draft compliance document
 * 3. Schedule meeting
 * 4. Upload evidence
 *
 * Each conversation shows:
 * - User message
 * - AI response with thinking
 * - Tool use with approval flow
 * - Final result
 */

export interface AIMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: string
  toolUse?: {
    id: string
    toolName: string
    parameters: Record<string, any>
    reasoning: string
    status: 'pending_approval' | 'approved' | 'executing' | 'completed' | 'rejected'
    result?: any
  }
}

export interface Conversation {
  id: string
  name: string
  description: string
  messages: AIMessage[]
}

/**
 * CONVERSATION 1: Calculate Capital Impaired (HAPPY PATH)
 * Task: Quarterly Capital Maintenance Check
 * Scenario: Assets $1.05M, Capital $1M → Profit distribution allowed
 */
export const calculateCapitalHappy: Conversation = {
  id: 'calculate-capital-happy',
  name: 'Calculate Capital Impaired (Happy Path)',
  description: 'User asks if profit can be distributed. AI checks capital maintenance rule.',
  messages: [
    {
      id: 'msg-1',
      role: 'user',
      content: 'I have current assets of $1.05M and original capital was $1M. Can we distribute profit this quarter?',
      timestamp: '10:30 AM'
    },
    {
      id: 'msg-2',
      role: 'assistant',
      content: 'Let me verify this against the capital maintenance requirement in AAOIFI SS-13 Section 8/7. I\'ll search the policy to confirm the exact rule.',
      timestamp: '10:30 AM',
      toolUse: {
        id: 'tool-1',
        toolName: 'search_policies',
        parameters: {
          query: 'AAOIFI SS-13 Section 8/7 capital maintenance profit distribution',
          filters: {
            standard: 'AAOIFI SS-13',
            section: '8/7'
          }
        },
        reasoning: 'Need to verify exact wording of capital maintenance requirement before calculating',
        status: 'pending_approval'
      }
    },
    {
      id: 'msg-3',
      role: 'assistant',
      content: 'Found the rule: "Capital must be intact before profit distribution. If capital impaired (assets < original capital), profit distribution is BLOCKED."\n\n**Calculation:**\n- Current assets: $1,050,000\n- Original capital: $1,000,000\n- Capital surplus: $50,000\n- Status: ✅ **CAPITAL INTACT**\n\n**Conclusion:** Profit distribution is **ALLOWED** this quarter. The $50,000 can be distributed per the agreed profit-sharing ratios.',
      timestamp: '10:30 AM',
      toolUse: {
        id: 'tool-1',
        toolName: 'search_policies',
        parameters: {
          query: 'AAOIFI SS-13 Section 8/7 capital maintenance profit distribution',
          filters: {
            standard: 'AAOIFI SS-13',
            section: '8/7'
          }
        },
        reasoning: 'Need to verify exact wording of capital maintenance requirement before calculating',
        status: 'completed',
        result: {
          found: true,
          source: 'AAOIFI SS-13 Section 8/7',
          rule: 'Capital must be intact before profit distribution'
        }
      }
    },
    {
      id: 'msg-4',
      role: 'user',
      content: 'Great! Can you draft the profit distribution certificate?',
      timestamp: '10:31 AM'
    },
    {
      id: 'msg-5',
      role: 'assistant',
      content: 'I\'ll draft the profit distribution certificate based on the template in our policy library.',
      timestamp: '10:31 AM',
      toolUse: {
        id: 'tool-2',
        toolName: 'draft_document',
        parameters: {
          template: 'profit-distribution-certificate',
          variables: {
            quarter: 'Q4 2025',
            originalCapital: '$1,000,000',
            currentAssets: '$1,050,000',
            profit: '$50,000',
            rabAlMalRatio: '60%',
            mudaribRatio: '40%',
            rabAlMalAmount: '$30,000',
            mudaribAmount: '$20,000'
          }
        },
        reasoning: 'Generate formal certificate documenting capital maintenance compliance and profit distribution',
        status: 'pending_approval'
      }
    },
    {
      id: 'msg-6',
      role: 'assistant',
      content: '✅ **Profit Distribution Certificate drafted successfully!**\n\n📄 Document saved: `Profit_Distribution_Q4_2025.pdf`\n\n**Summary:**\n- Rab al-Mal receives: $30,000 (60%)\n- Mudarib receives: $20,000 (40%)\n- Capital maintenance verified: ✅\n- Ready for Shariah Board approval',
      timestamp: '10:31 AM',
      toolUse: {
        id: 'tool-2',
        toolName: 'draft_document',
        parameters: {
          template: 'profit-distribution-certificate',
          variables: {
            quarter: 'Q4 2025',
            originalCapital: '$1,000,000',
            currentAssets: '$1,050,000',
            profit: '$50,000',
            rabAlMalRatio: '60%',
            mudaribRatio: '40%',
            rabAlMalAmount: '$30,000',
            mudaribAmount: '$20,000'
          }
        },
        reasoning: 'Generate formal certificate documenting capital maintenance compliance and profit distribution',
        status: 'completed',
        result: {
          documentId: 'doc-123',
          filename: 'Profit_Distribution_Q4_2025.pdf',
          downloadUrl: '/documents/doc-123'
        }
      }
    }
  ]
}

/**
 * CONVERSATION 2: Calculate Capital Impaired (SAD PATH)
 * Task: Quarterly Capital Maintenance Check
 * Scenario: Assets $950K, Capital $1M → Profit distribution BLOCKED
 */
export const calculateCapitalSad: Conversation = {
  id: 'calculate-capital-sad',
  name: 'Calculate Capital Impaired (Sad Path)',
  description: 'User asks if profit can be distributed when capital is impaired. AI blocks workflow.',
  messages: [
    {
      id: 'msg-1',
      role: 'user',
      content: 'Current assets are $950K and original capital was $1M. Can we distribute profit?',
      timestamp: '2:15 PM'
    },
    {
      id: 'msg-2',
      role: 'assistant',
      content: 'Let me check the capital maintenance rule from AAOIFI SS-13 Section 8/7.',
      timestamp: '2:15 PM',
      toolUse: {
        id: 'tool-1',
        toolName: 'search_policies',
        parameters: {
          query: 'AAOIFI SS-13 Section 8/7 capital maintenance',
          filters: {
            standard: 'AAOIFI SS-13',
            section: '8/7'
          }
        },
        reasoning: 'Verify capital maintenance requirement before calculating',
        status: 'pending_approval'
      }
    },
    {
      id: 'msg-3',
      role: 'assistant',
      content: '⚠️ **CAPITAL IMPAIRMENT DETECTED**\n\n**Calculation:**\n- Current assets: $950,000\n- Original capital: $1,000,000\n- Capital shortfall: -$50,000\n- Status: ❌ **CAPITAL IMPAIRED**\n\n**🔒 HARD GATE TRIGGERED**\n\nProfit distribution is **BLOCKED** per AAOIFI SS-13 §8/7. Capital must be restored to $1,000,000 before any profit distribution.\n\n**Next Steps:**\n1. Investigate cause of capital impairment\n2. Determine if Mudarib liable (misconduct/negligence)\n3. If no liability: Loss absorbed by Rab al-Mal\n4. Cannot distribute profit until capital restored',
      timestamp: '2:15 PM',
      toolUse: {
        id: 'tool-1',
        toolName: 'search_policies',
        parameters: {
          query: 'AAOIFI SS-13 Section 8/7 capital maintenance',
          filters: {
            standard: 'AAOIFI SS-13',
            section: '8/7'
          }
        },
        reasoning: 'Verify capital maintenance requirement before calculating',
        status: 'completed',
        result: {
          found: true,
          hardGate: true,
          blockWorkflow: true
        }
      }
    }
  ]
}

/**
 * CONVERSATION 3: Schedule Meeting
 * Task: Schedule Shariah Board Review
 */
export const scheduleMeeting: Conversation = {
  id: 'schedule-meeting',
  name: 'Schedule Meeting',
  description: 'User asks AI to schedule Shariah Board review meeting',
  messages: [
    {
      id: 'msg-1',
      role: 'user',
      content: 'Can you schedule a Shariah Board review meeting for next week to approve the profit distribution?',
      timestamp: '3:45 PM'
    },
    {
      id: 'msg-2',
      role: 'assistant',
      content: 'I\'ll check the Shariah Board members\' calendars and propose a meeting time.',
      timestamp: '3:45 PM',
      toolUse: {
        id: 'tool-1',
        toolName: 'check_calendars',
        parameters: {
          attendees: [
            'Sheikh Dr. Ahmad Al-Khalili (SSB Chair)',
            'Dr. Fatima Al-Mansouri (SSB Member)',
            'Prof. Omar Hassan (SSB Member)'
          ],
          timeRange: {
            start: '2025-11-17',
            end: '2025-11-21'
          },
          duration: '60 minutes'
        },
        reasoning: 'Find available time slot for all 3 Shariah Board members next week',
        status: 'pending_approval'
      }
    },
    {
      id: 'msg-3',
      role: 'assistant',
      content: '✅ **Available Time Slots Found:**\n\n1. **Tuesday, Nov 19** - 10:00 AM (all available)\n2. **Wednesday, Nov 20** - 2:00 PM (all available)\n3. **Thursday, Nov 21** - 9:00 AM (all available)\n\nWhich slot would you prefer?',
      timestamp: '3:45 PM',
      toolUse: {
        id: 'tool-1',
        toolName: 'check_calendars',
        parameters: {
          attendees: [
            'Sheikh Dr. Ahmad Al-Khalili (SSB Chair)',
            'Dr. Fatima Al-Mansouri (SSB Member)',
            'Prof. Omar Hassan (SSB Member)'
          ],
          timeRange: {
            start: '2025-11-17',
            end: '2025-11-21'
          },
          duration: '60 minutes'
        },
        reasoning: 'Find available time slot for all 3 Shariah Board members next week',
        status: 'completed',
        result: {
          availableSlots: [
            { date: '2025-11-19', time: '10:00 AM' },
            { date: '2025-11-20', time: '2:00 PM' },
            { date: '2025-11-21', time: '9:00 AM' }
          ]
        }
      }
    },
    {
      id: 'msg-4',
      role: 'user',
      content: 'Book Tuesday, Nov 19 at 10:00 AM please',
      timestamp: '3:46 PM'
    },
    {
      id: 'msg-5',
      role: 'assistant',
      content: 'I\'ll send calendar invites to all attendees and create the meeting.',
      timestamp: '3:46 PM',
      toolUse: {
        id: 'tool-2',
        toolName: 'schedule_meeting',
        parameters: {
          title: 'Shariah Board Review - Q4 2025 Profit Distribution',
          date: '2025-11-19',
          time: '10:00 AM',
          duration: '60 minutes',
          attendees: [
            'Sheikh Dr. Ahmad Al-Khalili',
            'Dr. Fatima Al-Mansouri',
            'Prof. Omar Hassan'
          ],
          agenda: [
            'Review Q4 2025 financial results',
            'Verify capital maintenance compliance',
            'Approve profit distribution certificate',
            'Discuss any Shariah concerns'
          ],
          attachments: ['Profit_Distribution_Q4_2025.pdf']
        },
        reasoning: 'Create meeting and send invites to all Shariah Board members',
        status: 'pending_approval'
      }
    },
    {
      id: 'msg-6',
      role: 'assistant',
      content: '✅ **Meeting Scheduled Successfully!**\n\n📅 **Shariah Board Review**\n- Date: Tuesday, November 19, 2025\n- Time: 10:00 AM - 11:00 AM\n- Location: Virtual (MS Teams link sent)\n- Attendees: 3 SSB members\n- Agenda: Profit distribution approval\n\n📧 Calendar invites sent to all attendees',
      timestamp: '3:46 PM',
      toolUse: {
        id: 'tool-2',
        toolName: 'schedule_meeting',
        parameters: {
          title: 'Shariah Board Review - Q4 2025 Profit Distribution',
          date: '2025-11-19',
          time: '10:00 AM',
          duration: '60 minutes',
          attendees: [
            'Sheikh Dr. Ahmad Al-Khalili',
            'Dr. Fatima Al-Mansouri',
            'Prof. Omar Hassan'
          ],
          agenda: [
            'Review Q4 2025 financial results',
            'Verify capital maintenance compliance',
            'Approve profit distribution certificate',
            'Discuss any Shariah concerns'
          ],
          attachments: ['Profit_Distribution_Q4_2025.pdf']
        },
        reasoning: 'Create meeting and send invites to all Shariah Board members',
        status: 'completed',
        result: {
          meetingId: 'mtg-456',
          teamsLink: 'https://teams.microsoft.com/l/meetup/...',
          invitesSent: 3
        }
      }
    }
  ]
}

/**
 * CONVERSATION 4: Upload Evidence
 * Task: Upload capital valuation report
 */
export const uploadEvidence: Conversation = {
  id: 'upload-evidence',
  name: 'Upload Evidence',
  description: 'User uploads evidence and AI verifies it meets requirements',
  messages: [
    {
      id: 'msg-1',
      role: 'user',
      content: 'I have the certified asset valuation report. Can you verify it meets the evidence requirements?',
      timestamp: '4:20 PM'
    },
    {
      id: 'msg-2',
      role: 'assistant',
      content: 'I\'ll analyze the document against the evidence requirements for this control.',
      timestamp: '4:20 PM',
      toolUse: {
        id: 'tool-1',
        toolName: 'analyze_document',
        parameters: {
          documentId: 'doc-789',
          filename: 'Asset_Valuation_Q4_2025.pdf',
          checklistItems: [
            'Certified by independent valuator',
            'Dated within last 30 days',
            'Includes itemized asset list',
            'Shows total asset value',
            'Valuator signature present'
          ]
        },
        reasoning: 'Verify document completeness before accepting as evidence',
        status: 'pending_approval'
      }
    },
    {
      id: 'msg-3',
      role: 'assistant',
      content: '✅ **Document Verification Complete**\n\n**Checklist Results:**\n✅ Certified by independent valuator (Ernst & Young Qatar)\n✅ Dated: November 5, 2025 (7 days ago)\n✅ Itemized asset list: 24 items\n✅ Total asset value: $1,050,000\n✅ Valuator signature: Dr. Khalid Al-Thani, CPA\n\n**Status:** Document meets ALL requirements. Uploading to evidence library...',
      timestamp: '4:20 PM',
      toolUse: {
        id: 'tool-1',
        toolName: 'analyze_document',
        parameters: {
          documentId: 'doc-789',
          filename: 'Asset_Valuation_Q4_2025.pdf',
          checklistItems: [
            'Certified by independent valuator',
            'Dated within last 30 days',
            'Includes itemized asset list',
            'Shows total asset value',
            'Valuator signature present'
          ]
        },
        reasoning: 'Verify document completeness before accepting as evidence',
        status: 'completed',
        result: {
          allChecksPassed: true,
          certificateIssuer: 'Ernst & Young Qatar',
          valuationDate: '2025-11-05',
          totalValue: 1050000
        }
      }
    },
    {
      id: 'msg-4',
      role: 'assistant',
      content: '✅ **Evidence uploaded successfully!**\n\n📄 **Asset_Valuation_Q4_2025.pdf**\n- Control: CTRL-MUD-PROFIT-002 (Capital Maintenance Gate)\n- Evidence requirement: "Current asset valuation report (certified)"\n- Status: ✅ Complete\n\n**Remaining evidence (2/3 complete):**\n✅ Current asset valuation report\n✅ Original capital amount confirmation\n⏳ Capital maintenance calculation worksheet (pending)',
      timestamp: '4:21 PM'
    }
  ]
}

/**
 * HELPER FUNCTIONS
 */

export function getConversationById(conversationId: string): Conversation | undefined {
  const conversations = [
    calculateCapitalHappy,
    calculateCapitalSad,
    scheduleMeeting,
    uploadEvidence
  ]
  return conversations.find(c => c.id === conversationId)
}

export function getAllConversations(): Conversation[] {
  return [
    calculateCapitalHappy,
    calculateCapitalSad,
    scheduleMeeting,
    uploadEvidence
  ]
}
