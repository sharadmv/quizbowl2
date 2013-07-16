alter table tossup add fulltext(question);
alter table tossup add fulltext(question, answer);
alter table tossup add fulltext(answer);
