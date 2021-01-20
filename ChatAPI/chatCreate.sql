DROP TABLE User_has_channel;
DROP TABLE Messages;
DROP TABLE ChatUsers;
DROP TABLE Channels;

DROP SEQUENCE USERS_USER_ID_SEQ;
DROP SEQUENCE CHANNELS_ID_SEQ;
DROP SEQUENCE MESSAGES_MESSAGE_ID_SEQ;

ALTER SESSION SET PLSCOPE_SETTINGS = 'IDENTIFIERS:NONE';
ALTER SESSION SET NLS_DATE_FORMAT='dd.MM.yyyy hh24:mi:ss';

CREATE TABLE ChatUsers (
	user_id INT NOT NULL,
	user_name VARCHAR2(40) NOT NULL,
	email VARCHAR2(30) NOT NULL,
	password VARCHAR2(100) NOT NULL,
	role VARCHAR2(10) NOT NULL,
    first_name BLOB NOT NULL,
    second_name BLOB NOT NULL,
    birth_date BLOB NOT NULL,
	constraint USERS_PK PRIMARY KEY (user_id)
    );

CREATE sequence USERS_USER_ID_SEQ;


CREATE trigger BI_USERS_USER_ID
  before insert on ChatUsers
  for each row
begin
  select USERS_USER_ID_SEQ.nextval into :NEW.user_id from dual;
end;

/

CREATE TABLE Channels (
	channel_id INT NOT NULL,
	name VARCHAR2(30) NOT NULL,
	theme VARCHAR2(30) NOT NULL,
	creation_time DATE NOT NULL,
    count_of_messages INT DEFAULT 0,
	constraint CHANNELS_PK PRIMARY KEY (channel_id)
    );

CREATE sequence CHANNELS_ID_SEQ;

CREATE trigger BI_CHANNELS_ID
  before insert on Channels
  for each row
begin
  select CHANNELS_ID_SEQ.nextval into :NEW.channel_id from dual;
end;

/

CREATE TABLE Messages (
	message_id INT NOT NULL,
	channel_id INT NOT NULL,
	type VARCHAR2(10) NOT NULL,
	content_text VARCHAR2(400),
	content_file BLOB,
	color VARCHAR2(6) NOT NULL,
	sender_id INT NOT NULL,
    creation_time DATE NOT NULL,
    number_in_chat INT NOT NULL,
	constraint MESSAGES_PK PRIMARY KEY (message_id),
    CONSTRAINT Messages_to_channels FOREIGN KEY (channel_id) REFERENCES Channels(channel_id) ON DELETE CASCADE,
    CONSTRAINT Messages_to_user FOREIGN KEY (sender_id) REFERENCES ChatUsers(user_id) 
    );
    

CREATE sequence MESSAGES_MESSAGE_ID_SEQ;

CREATE trigger BI_MESSAGES_MESSAGE_ID
  before insert on Messages
  for each row
begin
  select MESSAGES_MESSAGE_ID_SEQ.nextval into :NEW.message_id from dual;
end;

/

CREATE TABLE User_has_channel (
	user_id INT NOT NULL,
	channel_id INT NOT NULL,
    CONSTRAINT User_has_channel_fk0 FOREIGN KEY (user_id) REFERENCES ChatUsers(user_id) ON DELETE CASCADE,
    CONSTRAINT User_has_channel_fk1 FOREIGN KEY (channel_id) REFERENCES Channels(channel_id) ON DELETE CASCADE
    );


/





INSERT ALL
    INTO Channels(name, theme, creation_time) VALUES ('asqqq', 'qwdqw', to_date('10.04.1974 12:22:00', 'dd.MM.yyyy hh24:mi:ss'))
    INTO Channels(name, theme, creation_time) VALUES ('gerg', 'er', to_date('10.11.2002 18:12:11', 'dd.MM.yyyy hh24:mi:ss'))
    INTO Channels(name, theme, creation_time) VALUES ('adfa', 'assf', to_date('12.06.1999 14:22:43', 'dd.MM.yyyy hh24:mi:ss'))
SELECT * FROM dual;


INSERT ALL
    INTO User_has_channel(user_id, channel_id) VALUES (1,2)
    INTO User_has_channel(user_id, channel_id) VALUES (1,3)
    INTO User_has_channel(user_id, channel_id) VALUES (2,1)
SELECT * FROM dual;

SELECT m.message_id AS MessageId, m.channel_id AS ChannelId,
m.type, m.content_text AS ContentText,
m.color, m.sender_id AS SenderId, 
m.creation_time AS CreationTime, m.number_in_chat AS NumberInChat, 
u.user_name AS SenderUserName
FROM Messages m INNER JOIN ChatUsers u ON u.user_id = 7
WHERE m.creation_time = to_date('22.12.2020 13:31:29',  'dd.MM.yyyy hh24:mi:ss');


CREATE TABLE AesInfo (
    identify VARCHAR2(10),
	key BLOB,
	iv BLOB
    )

