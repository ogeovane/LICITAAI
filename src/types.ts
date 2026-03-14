export interface BidAnalysis {
  id: string;
  userId: string;
  fileName: string;
  createdAt: string;
  
  // General Info
  generalInfo: {
    organ: string;
    bidNumber: string;
    modality: string;
    judgmentType: string;
    object: string;
    estimatedValue?: string;
  };

  // Deadlines
  deadlines: {
    publicSession: string;
    proposalSubmission: string;
    appeal: string;
    impugnation: string;
    delivery: string;
    contractSigning: string;
  };

  // Payment
  paymentConditions: {
    deadline: string;
    measurement: boolean;
    delivery: boolean;
    retentions: string;
    invoiceRequirement: string;
    contractGuarantee: string;
  };

  // Location
  location: {
    address: string;
    city: string;
    state: string;
    department: string;
    deliveryPoint: string;
  };

  // Risks
  risks: Array<{
    title: string;
    riskLevel: 'high' | 'medium' | 'low';
    explanation: string;
    snippet: string;
    page?: number;
  }>;

  // Checklist
  checklist: Array<{
    document: string;
    status: 'required' | 'possibly' | 'not_identified';
  }>;

  // Summary
  executiveSummary: string[];
  
  // Difficulty Score
  difficultyScore: {
    level: 'Easy' | 'Moderate' | 'Difficult';
    score: number; // 0-100
    reasoning: string;
  };
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: string;
}
