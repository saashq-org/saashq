import { commonDateTypes, commonPaginateTypes } from './common';

const commonScheduleParams = `
    planId:String,
    indicatorId:String,
    groupId:String,
    structureTypeId:String,
    startDate:String,
    endDate:String,
    assignedUserIds:[String],
    name:String,
    customFieldsData:JSON,
`;

export const types = `

type StructureDetail {
    _id: String,
    title: String,
    order: String,
    code: String,
}

type PlanSchedule {
    _id:String,
    name: String
    indicatorId: String,
    assignedUserIds:[String]
    structureTypeId: String,
    status:String,
    groupId:String,
    startDate:Date,
    endDate:Date,
    customFieldsData:JSON
    createdAt:Date,

    assignedUsers:[User]
}

type Plan {
    _id: String,
    name: String,
    structureType: String,
    structureTypeId:String,
    status: String,
    tagId:String,
    configs:JSON,
    createdAt: Date,
    modifiedAt: Date
    closeDate: Date,
    startDate: Date,
    createDate: Date,
    plannerId:String,
    planner:User
    
    structureDetail:StructureDetail
    cardIds:[String]
    cards:JSON
    dashboard:JSON
    riskAssessments:[RiskAssessment]
}

    input ISchedule {
        _id: String,
        ${commonScheduleParams}
    }

`;

const commonMutationsParams = `
    name:String,
    structureType:String,
    structureTypeId:String,
    tagId:String,
    configs:JSON,
    startDate:String,
    closeDate:String,
    createDate:String,
`;

export const mutations = `
    addRiskAssessmentPlan(${commonMutationsParams}):JSON
    updateRiskAssessmentPlan(_id:String,${commonMutationsParams}):JSON
    removeRiskAssessmentPlan(ids:[String]):JSON
    duplicateRiskAssessmentPlan(_id:String):Plan
    changeStatusRiskAssessmentPlan(_id:String,status:String):Plan
    forceStartRiskAssessmentPlan(_id:String):Plan

    addRiskAssessmentPlanSchedule(${commonScheduleParams}):JSON
    updateRiskAssessmentPlanSchedule(_id:String,${commonScheduleParams}):JSON
    removeRiskAssessmentPlanSchedule(_id:String):JSON
    bulkUpdateRiskAssessmentSchedule(datas:[ISchedule]):JSON
`;

const commonQueriesParams = `
    isArchived:Boolean,
    plannerIds:[String],
    structureIds:[String],
    tagIds:[String],
    status:String,
    createDateFrom:String,
    createDateTo:String,
    startDateFrom:String,
    startDateTo:String,
    closeDateFrom:String,
    closeDateTo:String,
    createdAtFrom:String,
    createdAtTo:String,
    modifiedAtFrom:String,
    modifiedAtTo:String,
    ${commonPaginateTypes}
    ${commonDateTypes}
`;

export const queries = `
    riskAssessmentPlans(${commonQueriesParams}):[Plan]
    riskAssessmentPlansTotalCount(${commonQueriesParams}):Int
    riskAssessmentPlan(_id:String):Plan,
    riskAssessmentSchedules(planId:String):[PlanSchedule]
    riskAssessmentSchedulesTotalCount(planId:String):Int
`;
