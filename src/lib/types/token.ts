export interface Token {
    userId: string,
    role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'
    iat?: number,
    exp?: number
}