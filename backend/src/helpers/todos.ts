import { TodosAccess } from './todosAcess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { GetTodosResponse } from '../models/GetTodosResponse'

// TODO: Implement businessLogic
const logger = createLogger("Business Logic CRUD todo");
const todoAccessLayer = new TodosAccess();
// TODO: Implement businessLogic
export const createTodo = async (request: CreateTodoRequest, userId: string) => {
    logger.info("BL: createTodo");

    if (request) {
        logger.info("Adding a new todo");
        const todoId = uuid.v4()
        return await todoAccessLayer.createTodo({
            userId: userId,
            todoId: todoId,
            createdAt: (new Date()).toISOString(),
            done: false,
            attachmentUrl: null,
            ...request
        });
    } else {
        logger.error("Add failure");
    }
}

export const createAttachmentPresignedUrl = async (userId, todoId) => {
    const attachmentId = uuid.v4();

    return await todoAccessLayer.createAttachmentPresignedUrl(userId, todoId, attachmentId);
}

export async function getTodosForUser(userId: string, nextKey: any, limit: number, orderBy: string): Promise<GetTodosResponse> {
    logger.info(`Get todo for user: ${userId}`);

    return await todoAccessLayer.getTodos(userId, nextKey, limit, orderBy);
}

export const updateTodo = async (userId: string, todoId: string, request: UpdateTodoRequest) => {
    await todoAccessLayer.updateTodo(userId, todoId, request);
}

export const deleteTodo = async (userId: string, todoId: string) => {
    await todoAccessLayer.deleteTodo(userId, todoId);
}