import { MatPaginatorIntl } from '@angular/material/paginator';

const russianRangeLabel = (
  page: number,
  pageSize: number,
  length: number
): string => {
  if (length == 0 || pageSize == 0) {
    return `0 van ${length}`;
  }

  length = Math.max(length, 0);

  const startIndex: number = page * pageSize;

  const endIndex: number =
    startIndex < length
      ? Math.min(startIndex + pageSize, length)
      : startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} из ${length}`;
};

export function getRussianPaginatorIntl(): MatPaginatorIntl {
  const paginatorIntl: MatPaginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Элементов на странице:';
  paginatorIntl.nextPageLabel = 'Следующая страница';
  paginatorIntl.previousPageLabel = 'Предыдущая страница';
  paginatorIntl.firstPageLabel = 'Первая страница';
  paginatorIntl.lastPageLabel = 'Последняя страница';
  paginatorIntl.getRangeLabel = russianRangeLabel;

  return paginatorIntl;
}
