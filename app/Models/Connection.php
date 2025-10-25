<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\File;

class Connection
{
    use HasFactory;

    public static $globalData = [];
    protected static $query = [];
    protected static $selectedFields = [];
    public const DEVELOP_ENVIROMENT = 'localhost';
    public const DEFAULT_SERVER = 1;
    public const LOCAL = 0;
    public const REMOTE = 1;
    public const _FILE = 'connections.json';
    public const _FILE_CRYPT = 'connections';

    function __construct()
    {
        self::$globalData = $this->all();
    }

    public static function all()
    {
        $contenido = [];
        if (File::exists(base_path(static::_FILE))) {
            $contenido = json_decode(file_get_contents(base_path(static::_FILE)), true);
        } else if (File::exists(base_path(static::_FILE_CRYPT))) {
            $fileCrypted = file_get_contents(base_path(static::_FILE_CRYPT));
            $fileContent = Crypt::decrypt($fileCrypted);
            $contenido = json_decode($fileContent, true);
        }
        return $contenido;
    }

    public static function create(array $data)
    {
        $fileData = static::all();
        $data = ['id' => end($fileData)['id'] + 1] + $data;
        array_push($fileData, $data);
        file_put_contents(base_path(static::_FILE), json_encode($fileData, JSON_PRETTY_PRINT));
    }

    public static function find($id)
    {
        $json = Connection::all();
        foreach ($json as $c) {
            if ($c['id'] === $id) {
                return $c;
            }
        }
        return null;
    }

    public static function where($field = null, $operator = null, $value = null)
    {
        if (is_null($field)) {
            return new static();
        }

        if (func_num_args() === 2) {
            $value = $operator;
            $operator = '=';
        }

        self::$query[] = compact('field', 'operator', 'value');

        return new static();
    }

    public static function select(...$fields)
    {
        self::$selectedFields = $fields;
        return new static();
    }

    public static function get()
    {
        self::$globalData = Connection::all();

        foreach (self::$query as $query) {
            extract($query);

            self::$globalData = array_filter(self::$globalData, function ($item) use (&$field, &$operator, &$value) {
                switch ($operator) {
                    case '=':
                        return $item[$field] == $value;
                    case '>':
                        return $item[$field] > $value;
                    case '>=':
                        return $item[$field] >= $value;
                    case '<':
                        return $item[$field] < $value;
                    case '<=':
                        return $item[$field] <= $value;
                    case '!=':
                        return $item[$field] != $value;
                }
            });
        }

        // Reset the query after fetching the data
        self::$query = [];

        // Filter selected fields
        if (!empty(self::$selectedFields)) {
            self::$globalData = array_map(function ($item) {
                return array_intersect_key($item, array_flip(self::$selectedFields));
            }, self::$globalData);
        }

        return array_values(self::$globalData); // Re-index the array numerically
    }

    public static function first()
    {
        self::$globalData = Connection::all();

        foreach (self::$query as $query) {
            extract($query);

            foreach (self::$globalData as $item) {
                switch ($operator) {
                    case '=':
                        if ($item[$field] == $value) {
                            return $item;
                        }
                        break;
                    case '>':
                        if ($item[$field] > $value) {
                            return $item;
                        }
                        break;
                    case '>=':
                        if ($item[$field] >= $value) {
                            return $item;
                        }
                        break;
                    case '<':
                        if ($item[$field] < $value) {
                            return $item;
                        }
                        break;
                    case '<=':
                        if ($item[$field] <= $value) {
                            return $item;
                        }
                        break;
                    case '!=':
                        if ($item[$field] != $value) {
                            return $item;
                        }
                        break;
                }
            }
        }

        self::$query = [];

        return null; // No matching item found
    }
}
