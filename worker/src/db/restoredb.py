import subprocess

def execute_command(command):
    result = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if result.returncode != 0:
        print("Error executing command:", result.stderr.decode())
    return result.stdout.decode()

d1_database_name = "offchaindemo"  # Your D1 database name
output_file = "exported_data.sql"

# Step 1: Get list of all tables
tables_result = execute_command(f'wrangler d1 execute {d1_database_name} --command="SELECT name FROM sqlite_master WHERE type=\'table\';"')
tables = tables_result.strip().split('\n')[1:]  # Skip header row

sql_dump = ""

for table in tables:
    table = table.strip()
    if table:
        # Step 2: Get data from table
        data_result = execute_command(f'wrangler d1 execute {d1_database_name} --command="SELECT * FROM {table};"')
        data_lines = data_result.strip().split('\n')[1:]  # Skip header row

        if data_lines:
            insert_statement = f"INSERT INTO {table} VALUES "
            row_values = []

            for line in data_lines:
                values = line.strip().split('|')
                formatted_values = [f"'{value.replace('\'', '\'\'')}'" for value in values]
                row_values.append(f"({', '.join(formatted_values)})")

            insert_statement += ",\n".join(row_values) + ";\n\n"
            sql_dump += insert_statement

# Step 3: Write to output file
with open(output_file, 'w') as file:
    file.write(sql_dump)

print(f"Data exported to {output_file}")
