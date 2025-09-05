// 本地存储服务
export interface UserData {
  favoriteIds: string[]
  wrongAnswerIds: string[]
  studyStats: {
    totalAnswered: number
    correctCount: number
    wrongCount: number
    favoriteCount: number
  }
}

const STORAGE_KEY = 'tiku_user_data'

// 获取用户数据
export function getUserData(): UserData {
  const data = localStorage.getItem(STORAGE_KEY)
  if (data) {
    try {
      return JSON.parse(data)
    } catch (error) {
      console.error('解析用户数据失败:', error)
    }
  }
  
  return {
    favoriteIds: [],
    wrongAnswerIds: [],
    studyStats: {
      totalAnswered: 0,
      correctCount: 0,
      wrongCount: 0,
      favoriteCount: 0
    }
  }
}

// 保存用户数据
export function saveUserData(data: UserData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('保存用户数据失败:', error)
  }
}

// 收藏相关方法
export function getFavoriteIds(): string[] {
  return getUserData().favoriteIds
}

export function isFavorite(questionId: string): boolean {
  const favoriteIds = getFavoriteIds()
  return Array.isArray(favoriteIds) ? favoriteIds.includes(questionId) : false
}

export function addToFavorites(questionId: string): void {
  const userData = getUserData()
  if (!Array.isArray(userData.favoriteIds)) {
    userData.favoriteIds = []
  }
  if (!userData.favoriteIds.includes(questionId)) {
    userData.favoriteIds.push(questionId)
    // 确保 studyStats 存在
    if (!userData.studyStats) {
      userData.studyStats = {
        totalAnswered: 0,
        correctCount: 0,
        wrongCount: 0,
        favoriteCount: 0
      }
    }
    userData.studyStats.favoriteCount = userData.favoriteIds.length
    saveUserData(userData)
  }
}

export function removeFromFavorites(questionId: string): void {
  const userData = getUserData()
  if (!Array.isArray(userData.favoriteIds)) {
    userData.favoriteIds = []
  }
  userData.favoriteIds = userData.favoriteIds.filter(id => id !== questionId)
  // 确保 studyStats 存在
  if (!userData.studyStats) {
    userData.studyStats = {
      totalAnswered: 0,
      correctCount: 0,
      wrongCount: 0,
      favoriteCount: 0
    }
  }
  userData.studyStats.favoriteCount = userData.favoriteIds.length
  saveUserData(userData)
}

// 错题相关方法
export function getWrongAnswerIds(): string[] {
  const userData = getUserData()
  return Array.isArray(userData.wrongAnswerIds) ? userData.wrongAnswerIds : []
}

export function isWrongAnswer(questionId: string): boolean {
  return getWrongAnswerIds().includes(questionId)
}

export function addToWrongAnswers(questionId: string): void {
  const userData = getUserData()
  if (!userData.wrongAnswerIds.includes(questionId)) {
    userData.wrongAnswerIds.push(questionId)
    userData.studyStats.wrongCount = userData.wrongAnswerIds.length
    saveUserData(userData)
  }
}

export function removeFromWrongAnswers(questionId: string): void {
  const userData = getUserData()
  userData.wrongAnswerIds = userData.wrongAnswerIds.filter(id => id !== questionId)
  userData.studyStats.wrongCount = userData.wrongAnswerIds.length
  saveUserData(userData)
}

// 统计相关方法
export function getStudyStats() {
  return getUserData().studyStats
}

export function updateStudyStats(correct: boolean): void {
  const userData = getUserData()
  userData.studyStats.totalAnswered++
  if (correct) {
    userData.studyStats.correctCount++
  } else {
    userData.studyStats.wrongCount++
  }
  saveUserData(userData)
}

// 清空数据
export function clearAllFavorites(): void {
  const userData = getUserData()
  userData.favoriteIds = []
  userData.studyStats.favoriteCount = 0
  saveUserData(userData)
}

export function clearAllWrongAnswers(): void {
  const userData = getUserData()
  userData.wrongAnswerIds = []
  userData.studyStats.wrongCount = 0
  saveUserData(userData)
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEY)
}