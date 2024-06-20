import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";
import { PageData } from "./page-data.interface";

export const Pagination = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const query = context.switchToHttp().getRequest<Request>().query;

    const page = Number(query["page"]);
    const perPage = Number(query["perPage"]);

    const pageData: PageData = {
      page: Number.isNaN(page) ? null : page,
      perPage: Number.isNaN(perPage) ? null : perPage,
    };

    return pageData;
  },
);
