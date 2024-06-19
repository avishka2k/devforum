-- Initialize the database with this queries. Execute each query one by one.


-- Create a stored procedure to delete rows with null profileId
CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_null_rows`()
DELETE FROM social_accounts
WHERE social_accounts.profileId IS NULL;