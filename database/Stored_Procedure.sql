DELIMITER $$

DROP PROCEDURE IF EXISTS sp_AuthUser $$

CREATE PROCEDURE sp_AuthUser (
    IN p_Action VARCHAR(20),
    IN p_Name VARCHAR(100),
    IN p_Email VARCHAR(100),
    IN p_PasswordHash VARCHAR(255)
)
BEGIN

    -- REGISTER
    IF p_Action = 'REGISTER' THEN
    
        IF EXISTS (SELECT 1 FROM Users WHERE Email = p_Email) THEN
            SELECT 409 AS StatusCode, 'Email already exists' AS Message;
        ELSE
            INSERT INTO Users (Name, Email, PasswordHash)
            VALUES (p_Name, p_Email, p_PasswordHash);

            SELECT 200 AS StatusCode, 'User registered successfully' AS Message;
        END IF;

    -- LOGIN
    ELSEIF p_Action = 'LOGIN' THEN
    
        IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = p_Email) THEN
            SELECT 404 AS StatusCode, 'User not found' AS Message;
        ELSE
            SELECT 
                200 AS StatusCode,
                'Login Successful' AS Message,
                Id,
                Name,
                Email,
                PasswordHash
            FROM Users
            WHERE Email = p_Email;
        END IF;
ELSEIF p_Action = 'PROFILE' THEN
    IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = p_Email) THEN
        SELECT 404 AS StatusCode, 'User not found' AS Message;
    ELSE
        SELECT 
            200 AS StatusCode,
            'Profile data fetched' AS Message,
            Id,
            Name,
            Email,
            NULL AS PasswordHash -- Do not return the hash for profile calls
        FROM Users
        WHERE Email = p_Email;
    END IF;
    END IF;
    

END $$

DELIMITER ;